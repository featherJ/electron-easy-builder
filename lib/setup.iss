[Setup]
AppId={#AppId}
AppName={#AppName}
#if "" != NameVersion
  AppVerName={#NameVersion}
#endif
#if "" != Publisher
  AppPublisher={#Publisher}
#endif
#if "" != PublisherURL
  AppPublisherURL={#PublisherURL}
#endif
#if "" != SupportURL
  AppSupportURL={#SupportURL}
#endif
#if "" != UpdatesURL
  AppUpdatesURL={#UpdatesURL}
#endif
DefaultGroupName={#AppName}
OutputDir={#OutputDir}
OutputBaseFilename={#OutputBasename}
; Compression=lzma2/ultra64
Compression=none
; SolidCompression=yes
#if "" != WizardImageFile
  WizardImageFile={#WizardImageFile}
#endif
#if "" != WizardSmallImageFile
  WizardSmallImageFile={#WizardSmallImageFile}
#endif
#if "" != SetupIconFile
  SetupIconFile={#SetupIconFile}
#endif
UninstallDisplayIcon={app}\\{#ExeBasename}\n";
ChangesAssociations={#HasAssociations}
MinVersion=6.1sp1
SourceDir={#SourceDir}
AppVersion={#Version}
ShowLanguageDialog=auto
ArchitecturesAllowed={#ArchitecturesAllowed}
WizardStyle=modern
DisableProgramGroupPage=yes
DisableWelcomePage=no
CloseApplications=no


#if "user" == InstallTarget
    DefaultDirName={userpf}\{#DirName}
    PrivilegesRequired=lowest
#else
    #if "x64" == Arch
        DefaultDirName={pf64}\{#DirName}
    #else
        DefaultDirName={pf}\{#DirName}
    #endif
#endif


[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: checkablealone
; https://stackoverflow.com/questions/56441620/quick-lanch-bar-and-inno-setup-v6
Name: "quicklaunchicon"; Description: "{cm:CreateQuickLaunchIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: checkablealone; OnlyBelowVersion: 0,6.1


[Icons]
#if "" == AppUserId
  Name: "{group}\{#AppName}"; Filename: "{app}\{#ExeBasename}"
  Name: "{autodesktop}\{#AppName}"; Filename: "{app}\{#ExeBasename}"; Tasks: desktopicon
  Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\{#AppName}"; Filename: "{app}\{#ExeBasename}"; Tasks: quicklaunchicon
#else
  Name: "{group}\{#AppName}"; Filename: "{app}\{#ExeBasename}"; AppUserModelID: "{#AppUserId}"
  Name: "{autodesktop}\{#AppName}"; Filename: "{app}\{#ExeBasename}"; Tasks: desktopicon; AppUserModelID: "{#AppUserId}"
  Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\{#AppName}"; Filename: "{app}\{#ExeBasename}"; Tasks: quicklaunchicon; AppUserModelID: "{#AppUserId}"
#endif

[Run]
Filename: "{app}\{#ExeBasename}"; Description: "{cm:LaunchProgram,{#AppName}}"; Flags: nowait postinstall

[Files]
Source: "*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs


[Code]
function IsBackgroundUpdate(): Boolean;
begin
  Result := ExpandConstant('{param:update|false}') <> 'false';
end;

function IsNotBackgroundUpdate(): Boolean;
begin
  Result := not IsBackgroundUpdate();
end;


function IsAppRunning(const FileName : string): Boolean;
var
    FSWbemLocator: Variant;
    FWMIService   : Variant;
    FWbemObjectSet: Variant;
begin
    Result := false;
    FSWbemLocator := CreateOleObject('WBEMScripting.SWBEMLocator');
    FWMIService := FSWbemLocator.ConnectServer('', 'root\CIMV2', '', '');
    FWbemObjectSet :=
      FWMIService.ExecQuery(
        Format('SELECT Name FROM Win32_Process Where Name="%s"', [FileName]));
    Result := (FWbemObjectSet.Count > 0);
    FWbemObjectSet := Unassigned;
    FWMIService := Unassigned;
    FSWbemLocator := Unassigned;
end;


procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssInstall  then
  begin
    if IsBackgroundUpdate() then
    begin
      // 直接调用等待应用程序退出的过程
      while IsAppRunning('{#ExeBasename}') do
      begin
        Sleep(1000); // 每秒检查一次应用程序是否退出
      end;
    end
    else
    begin
      while IsAppRunning('{#ExeBasename}') do
      begin
        if MsgBox(FmtMessage(SetupMessage(msgSetupAppRunningError), ['{#ExeBasename}']), mbError, MB_OKCANCEL) = IDOK then
        begin
          // 用户选择“确定”，再次检测
        end
        else
        begin
          // 用户选择“取消”，退出安装
          Abort();
          Exit;
        end;
      end;
    end;
  end;
end;
