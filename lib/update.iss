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
#if "" != SetupIconFile
  SetupIconFile={#SetupIconFile}
#endif
UninstallDisplayIcon={app}\{#ExeBasename}
MinVersion=6.1sp1
SourceDir={#SourceDir}
AppVersion={#Version}
ShowLanguageDialog=auto
ArchitecturesAllowed={#ArchitecturesAllowed}
WizardStyle=modern
DisableProgramGroupPage=yes
DisableWelcomePage=no
CloseApplications=no
DisableReadyPage=yes
DisableReadyMemo=yes
DisableFinishedPage=yes
WizardImageStretch=no
UsePreviousAppDir=yes

#if "sign" == Sign
  SignTool=sha1
  SignTool=sha256
  SignedUninstaller=yes
#endif

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

[Run]
Filename: "{app}\{#ExeBasename}"; Description: "{cm:LaunchProgram,{#AppName}}"; Flags: nowait postinstall

[Files]
Source: "resources\*"; DestDir: "{app}\resources"; Flags: ignoreversion recursesubdirs createallsubdirs

[Code]
function IsBackgroundUpdate(): Boolean;
begin
  Result := (Pos('/update', LowerCase(ExpandConstant('{cmdline}'))) > 0);
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
        // 每秒检查一次应用程序是否退出
        Sleep(1000); 
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
