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

[Icons]
Name: "{commonprograms}\{#AppName}"; Filename: "{app}\\{#ExeBasename}"
Name: "{commondesktop}\{#AppName}"; Filename: "{app}\{#ExeBasename}"; Tasks: desktopicon

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: checkablealone
Name: "quicklaunchicon"; Description: "{cm:CreateQuickLaunchIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: checkablealone

[Run]
Filename: "{app}\{#ExeBasename}"; Description: "{cm:LaunchProgram,{#StringChange(AppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

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
    MsgBox('isRunning 1', mbConfirmation, MB_OKCANCEL);
    FSWbemLocator := CreateOleObject('WBEMScripting.SWBEMLocator');
    MsgBox('isRunning 2', mbConfirmation, MB_OKCANCEL);
    FWMIService := FSWbemLocator.ConnectServer('', 'root\\CIMV2', '', '');
    MsgBox('isRunning 3', mbConfirmation, MB_OKCANCEL);
    FWbemObjectSet := FWMIService.ExecQuery(Format('SELECT Name FROM Win32_Process Where Name="%s"',[FileName]));
    MsgBox('isRunning 4', mbConfirmation, MB_OKCANCEL);
    Result := (FWbemObjectSet.Count > 0);
    MsgBox('isRunning 5', mbConfirmation, MB_OKCANCEL);
    FWbemObjectSet := Unassigned;
    MsgBox('isRunning 6', mbConfirmation, MB_OKCANCEL);
    FWMIService := Unassigned;
    MsgBox('isRunning 7', mbConfirmation, MB_OKCANCEL);
    FSWbemLocator := Unassigned;
    MsgBox('isRunning 8', mbConfirmation, MB_OKCANCEL);
end;


procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssInstall  then
  begin
    MsgBox('测试，在ssInstall中。程序名：{#ExeBasename}', mbConfirmation, MB_OKCANCEL);
    if IsBackgroundUpdate() then
    begin
      // 直接调用等待应用程序退出的过程
      while IsAppRunning('{#ExeBasename}') do
      begin
        Log(Format('%s 仍在运行，等待退出...', ['{#ExeBasename}']));
        Sleep(1000); // 每秒检查一次应用程序是否退出
      end;
      Log('应用程序已退出，继续安装...');
    end
    else
    begin
      while IsAppRunning('{#ExeBasename}') do
      begin
        if MsgBox(Format(ExpandConstant('{cm:SetupAppRunningError}'), ['YourApplication.exe']), mbError, MB_OKCANCEL) = IDOK then
        begin
          // 用户选择“确定”，再次检测
          Log('用户点击确定，检查程序状态...');
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

function InitializeSetup():Boolean;
begin
 MsgBox('测试，初始化中。程序名：{#ExeBasename}', mbConfirmation, MB_OKCANCEL);
 Result := True
end;