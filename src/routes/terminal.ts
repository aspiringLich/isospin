let raw = `
  : FloppaBoot(TM) v3.12.1
  : Floppa is a registered trademark of Floppa Manufacturing, LTD
  : All Rights Reserved
  : 
delay 100
  : Starting Power-on Self Test...
  :
delay 100
  : CPU: Nokia(R) Mote(TM) Transverse CPU @ 9.21GHz
  :   Speed: 9.20GHz
  :   Count: 256
  : 
delay 100
  : RAM: GigaDIMM(TM) Antisynchronous 1.23THz (0.8ps)
  :   Size: (-32 + 3i)KiB
  : 
delay 100
  : Caches (sum of all):
  :   L1d:      9MiB (256 Instances)
  :   L1i:      12MiB (256 Instances)
  :   L2:       1GiB (64 Instances)
  :   L3:       2GiB (8 Instances)
  :   L4:       4GiB (1 Instance)

delay 300
  : PCI Devices:
  : Bus  PID  Class  Device
  :   0    1   9007  Nokia Mote CPU Host Bridge
  :   0    4   4ac1  USB 5.0 Host Controller
  :   0  4.1   4ac1  USB 5.0 Host Controller
  :   0  4.2   4ac1  USB 5.0 Host Controller
  :   0  4.3   4ac1  USB 5.0 Host Controller
  :   2    6   b606  IDE Controller
  :   1  6.1   45a8  SMBus Controller
  :   1    7   bf0d  Display Controller
  :   0    8   f2e7  Neural Accelerator
  :   2   12   6a2f  PCI Bridge
  :
delay 200
  : Booting from Floppy Drive A...
  : 
delay 500
  : /dev/sda5: clean, 373574/907536 files, 3200659/367264 blocks
OK: Started plymouth-start.ser…e - Show Plymouth Boot Screen.
OK: Started systemd-ask-passwo…uests to Plymouth Directory Watch.
OK: Reached target paths.target - Path Units.
OK: Reached target basic.target - Basic System.
OK: Found device dev-disk-by floppy.
OK: Reached target initrd-root…e.target - Initrd Root Device.
OK: Finished dracut-initqueue.…rvice - dracut initqueue hook.
OK: Reached target remote-fs-p…eparation for Remote File Systems.
OK: Reached target remote-fs.target - Remote File Systems.
__: Starting systemd-fsck-root…d3f-371a-4008-b19e-3d0c5a8b05dc...
OK: Finished systemd-fsck-root…d5d3f-371a-4008-b19e-3d0c5a8b05dc.
OK:ounting sysroot.mount - /sysroot...
OK: Mounted sysroot.mount - /sysroot.
OK: Reached target initrd-root…get - Initrd Root File System.
__: Starting initrd-parse-etc.…onfiguration from the Real Root...
OK: Finished initrd-parse-etc.… Configuration from the Real Root.
OK: Reached target initrd-fs.target - Initrd File Systems.
OK: Reached target initrd.target - Initrd Default Target.
__: Starting dracut-pre-pivot.…acut pre-pivot and cleanup hook...
OK: Finished dracut-pre-pivot.…dracut pre-pivot and cleanup hook.
__: Starting initrd-cleanup.se…ng Up and Shutting Down Daemons...
OK: Stopped target network.target - Network.
OK: Stopped target timers.target - Timer Units.
OK: Closed dbus.socket - D-Bus System Message Bus Socket.
OK: Stopped dracut-pre-pivot.s…dracut pre-pivot and cleanup hook.
OK: Stopped target initrd.target - Initrd Default Target.
OK: Stopped target basic.target - Basic System.
OK: Stopped target initrd-root…e.target - Initrd Root Device.
OK: Stopped target initrd-usr-…get - Initrd /usr File System.
OK: Stopped target paths.target - Path Units.
OK: Stopped target remote-fs.target - Remote File Systems.
OK: Stopped target remote-fs-p…eparation for Remote File Systems.
OK: Stopped target slices.target - Slice Units.
OK: Stopped target sockets.target - Socket Units.
OK: Stopped target sysinit.target - System Initialization.
OK: Stopped target local-fs.target - Local File Systems.
OK: Stopped target swap.target - Swaps.
OK: Stopped dracut-initqueue.service - dracut initqueue hook.
__: Starting plymouth-switch-r… - Plymouth switch root service...
OK: Stopped systemd-sysctl.service - Apply Kernel Variables.
OK: Stopped systemd-modules-lo…service - Load Kernel Modules.
OK: Stopped systemd-tmpfiles-s…te Volatile Files and Directories.
OK: Stopped systemd-udev-trigg…e - Coldplug All udev Devices.
__: Stopping systemd-udevd.ser…ger for Device Events and Files...
OK: Finished initrd-cleanup.se…ning Up and Shutting Down Daemons.
OK: Stopped systemd-udevd.serv…nager for Device Events and Files.
OK: Closed systemd-udevd-contr….socket - udev Control Socket.
OK: Closed systemd-udevd-kernel.socket - udev Kernel Socket.
OK: Stopped dracut-pre-udev.service - dracut pre-udev hook.
OK: Stopped dracut-cmdline.service - dracut cmdline hook.
OK: Stopped dracut-cmdline-ask…for additional cmdline parameters.
__: Starting initrd-udevadm-cl…ice - Cleanup udev Database...
OK: Stopped systemd-tmpfiles-s…reate Static Device Nodes in /dev.
OK: Stopped kmod-static-nodes.…reate List of Static Device Nodes.
OK: Stopped systemd-sysusers.service - Create System Users.
OK: Finished initrd-udevadm-cl…rvice - Cleanup udev Database.
OK: Reached target initrd-switch-root.target - Switch Root.
OK: Finished plymouth-switch-r…0m - Plymouth switch root service.
__: Starting initrd-switch-root.service - Switch Root...
OK: Stopped initrd-switch-root.service - Switch Root.
OK: Created slice system-getty.slice - Slice /system/getty.
OK: Created slice system-syste… - Slice /system/systemd-fsck.
OK: Created slice system-syste… Slice /system/systemd-zram-setup.
OK: Created slice user.slice - User and Session Slice.
OK: Started systemd-ask-passwo… Requests to Wall Directory Watch.
OK: Set up automount proc-sys-…rmats File System Automount Point.
OK: Reached target cryptsetup.…get - Local Encrypted Volumes.
OK: Reached target getty.target - Login Prompts.
OK: Stopped target initrd-switch-root.target - Switch Root.
OK: Stopped target initrd-fs.target - Initrd File Systems.
OK: Stopped target initrd-root…get - Initrd Root File System.
OK: Reached target integrityse…Local Integrity Protected Volumes.
OK: Reached target slices.target - Slice Units.
OK: Reached target veritysetup… - Local Verity Protected Volumes.
OK: Listening on dm-event.sock… Device-mapper event daemon FIFOs.
OK: Listening on lvm2-lvmpolld…ket - LVM2 poll daemon socket.
OK: Listening on systemd-cored…et - Process Core Dump Socket.
OK: Listening on systemd-initc… initctl Compatibility Named Pipe.
OK: Listening on systemd-oomd.…Out-Of-Memory (OOM) Killer Socket.
OK: Listening on systemd-udevd….socket - udev Control Socket.
OK: Listening on systemd-udevd…l.socket - udev Kernel Socket.
OK: Listening on systemd-userd…0m - User Database Manager Socket.
__: Mounting dev-hugepages.mount - Huge Pages File System...
__: Mounting dev-mqueue.mountsys-… - Kernel Debug File System...
__: Mounting sys-kernel-tracin… - Kernel Trace File System...
__: Sarting kmod-static-nodes…ate List of Static Device Nodes...
__: Sarting lvm2-monitor.serv…ng dmeventd or progress polling...
__: Sarting modprobe@configfs…m - Load Kernel Module configfs...
__: Sarting modprobe@dm_mod.s…[0m - Load Kernel Module dm_mod...
__: Sarting modprobe@drm.service - Load Kernel Module drm...
__: Sarting modprobe@fuse.ser…e - Load Kernel Module fuse...
__: Sarting modprobe@loop.ser…e - Load Kernel Module loop...
OK: Stopped plymouth-switch-ro…0m - Plymouth switch root service.
OK: Stopped systemd-fsck-root.… File System Check on Root Device.
OK: Stopped systemd-journald.service - Journal Service.
__: Starting systemd-journald.service - Journal Service...
__: Starting systemd-modules-l…rvice - Load Kernel Modules...
__: Starting systemd-network-g… units from Kernel command line...
__: Starting systemd-remount-f…nt Root and Kernel File Systems...
__: Starting systemd-udev-trig…[0m - Coldplug All udev Devices...
OK: Mounted dev-hugepages.mount - Huge Pages File System.
OK: Mounted dev-mqueue.mountOSIX Message Queue File System.
OK: Mounted sys-kernel-debug.m…nt - Kernel Debug File System.
OK: Mounted sys-kernel-tracing…nt - Kernel Trace File System.
OK: Finished kmod-static-nodes…reate List of Static Device Nodes.
OK: Finished modprobe@configfs…[0m - Load Kernel Module configfs.
OK: Finished modprobe@dm_mod.s…e - Load Kernel Module dm_mod.
OK: Finished modprobe@drm.service - Load Kernel Module drm.
OK: Finished modprobe@fuse.service - Load Kernel Module fuse.
OK: Finished modprobe@loop.service - Load Kernel Module loop.
OK: Finished systemd-modules-l…service - Load Kernel Modules.
OK: Finished systemd-network-g…rk units from Kernel command line.
OK: Finished systemd-remount-f…ount Root and Kernel File Systems.
__: Mounting sys-fs-fuse-conne… - FUSE Control File System...
__: Starting systemd-random-se…ice - Load/Save Random Seed...
__: Starting systemd-sysctl.se…ce - Apply Kernel Variables...
__: Starting systemd-tmpfiles-…ate Static Device Nodes in /dev...
OK: Started systemd-journald.service - Journal Service.
OK: Mounted sys-fs-fuse-connec…nt - FUSE Control File System.
__: Starting systemd-journal-f…h Journal to Persistent Storage...
OK: Finished systemd-random-se…rvice - Load/Save Random Seed.
OK: Finished systemd-sysctl.service - Apply Kernel Variables.
OK: Finished systemd-tmpfiles-…reate Static Device Nodes in /dev.
__: Starting systemd-udevd.ser…ger for Device Events and Files...
OK: Finished systemd-udev-trig…e - Coldplug All udev Devices.
OK: Finished systemd-journal-f…ush Journal to Persistent Storage.
__: Started systemd-udevd.serv…nager for Device Events and Files.
__: Starting modprobe@configfs…m - Load Kernel Module configfs...
OK: Found device dev-zram0.device - /dev/zram0.
__: Starting modprobe@fuse.ser…e - Load Kernel Module fuse...
__: Starting systemd-zram-setu…[0m - Create swap on /dev/zram0...
OK: Finished modprobe@configfs…[0m - Load Kernel Module configfs.
OK: Finished modprobe@fuse.service - Load Kernel Module fuse.
OK: Finished systemd-zram-setu…e - Create swap on /dev/zram0.
__: Activating swap dev-zram0.…- Compressed Swap on /dev/zram0...
OK: Activated swap dev-zram0.s…m - Compressed Swap on /dev/zram0.
OK: Reached target swap.target - Swaps.
__: Mounting tmp.mount - Temporary Directory /tmp...
OK: Mounted tmp.mount - Temporary Directory /tmp.
OK: Created slice system-syste…- Slice /system/systemd-backlight.
__: Starting systemd-backlight…ss of backlight:intel_backlight...
OK: Finished systemd-backlight…ness of backlight:intel_backlight.
OK: Found device dev-disk-by…BLACK SN770 1TB floppy.
OK: Finished lvm2-monitor.serv…sing dmeventd or progress polling.
OK: Reached target local-fs-pr…reparation for Local File Systems.
__: Mounting home.mount - /home...
__: Mounting var-lib-snapd-sna…Mount unit for bare, revision 5...
__: Mounting var-lib-snapd-sna…nit for chromium, revision 2655...
__: Mounting var-lib-snapd-sna…nit for chromium, revision 2666...
__: Mounting var-lib-snapd-sna…for compress-video, revision 29...
__: Mounting var-lib-snapd-sna…for compress-video, revision 30...
__: Mounting var-lib-snapd-sna…t unit for core, revision 16091...
__: Mounting var-lib-snapd-sna…t unit for core, revision 16202...
__: Mounting var-lib-snapd-sna… unit for core18, revision 2785...
__: Mounting var-lib-snapd-sna… unit for core18, revision 2790...
__: Mounting var-lib-snapd-sna… unit for core20, revision 1974...
__: Mounting var-lib-snapd-sna… unit for core20, revision 2015...
__: Mounting var-lib-snapd-sna…t unit for core22, revision 858...
__: Mounting var-lib-snapd-sna…t unit for core22, revision 864...
__: Mounting var-lib-snapd-sna…unt unit for cups, revision 974...
__: Mounting var-lib-snapd-sna…unt unit for cups, revision 980...
__: Mounting var-lib-snapd-sna…r gnome-3-28-1804, revision 194...
__: Mounting var-lib-snapd-sna…r gnome-3-28-1804, revision 198...
__: Mounting var-lib-snapd-sna…r gnome-3-38-2004, revision 140...
__: Mounting var-lib-snapd-sna…r gnome-3-38-2004, revision 143...
__: Mounting var-lib-snapd-sna…for gnome-42-2204, revision 132...
__: Mounting var-lib-snapd-sna…for gnome-42-2204, revision 141...
__: Mounting var-lib-snapd-sna…tk-common-themes, revision 1535...
__: Mounting var-lib-snapd-sna…nt unit for htop, revision 3758...
__: Mounting var-lib-snapd-sna…nt unit for htop, revision 3873...
__: Mounting var-lib-snapd-sna…ij-idea-community, revision 456...
__: Mounting var-lib-snapd-sna…ij-idea-community, revision 460...
__: Mounting var-lib-snapd-sna…rameworks-5-core18, revision 32...
__: Mounting var-lib-snapd-sna…rameworks-5-core18, revision 35...
__: Mounting var-lib-snapd-sna…nt unit for ksnip, revision 443...
__: Mounting var-lib-snapd-sna…nt unit for ksnip, revision 488...
__: Mounting var-lib-snapd-sna…it for riseup-vpn, revision 179...
__: Mounting var-lib-snapd-sna… unit for snapd, revision 20092...
__: Mounting var-lib-snapd-sna… unit for snapd, revision 20290...
__: Mounting var-lib-snapd-sna…nt unit for webots, revision 24...
__: Mounting var-lib-snapd-sna…nt unit for webots, revision 25...
__: Mounting var-lib-snapd-sna…t for zoom-client, revision 208...
__: Mounting var-lib-snapd-sna…t for zoom-client, revision 210...
__: Starting systemd-fsck@dev-…188-f6a0-4588-9287-9b72a7cd1710...
__: Starting systemd-fsck@dev-… on /dev/disk/by-uuid/B865-4EC4...
OK: Mounted home.mount - /home.
OK: Mounted var-lib-snapd-snap…- Mount unit for bare, revision 5.
OK: Mounted var-lib-snapd-snap… unit for chromium, revision 2655.
OK: Mounted var-lib-snapd-snap… unit for chromium, revision 2666.
OK: Mounted var-lib-snapd-snap…t for compress-video, revision 29.
OK: Mounted var-lib-snapd-snap…t for compress-video, revision 30.
OK: Mounted var-lib-snapd-snap…unt unit for core, revision 16091.
OK: Mounted var-lib-snapd-snap…unt unit for core, revision 16202.
OK: Mounted var-lib-snapd-snap…nt unit for core18, revision 2785.
OK: Mounted var-lib-snapd-snap…nt unit for core18, revision 2790.
OK: Mounted var-lib-snapd-snap…nt unit for core20, revision 1974.
OK: Mounted var-lib-snapd-snap…nt unit for core20, revision 2015.
OK: Mounted var-lib-snapd-snap…unt unit for core22, revision 858.
OK: Mounted var-lib-snapd-snap…unt unit for core22, revision 864.
OK: Mounted var-lib-snapd-snap…Mount unit for cups, revision 974.
OK: Mounted var-lib-snapd-snap…Mount unit for cups, revision 980.
OK: Mounted var-lib-snapd-snap…for gnome-3-28-1804, revision 194.
OK: Mounted var-lib-snapd-snap…for gnome-3-28-1804, revision 198.
OK: Mounted var-lib-snapd-snap…for gnome-3-38-2004, revision 140.
OK: Mounted var-lib-snapd-snap…for gnome-3-38-2004, revision 143.
OK: Mounted var-lib-snapd-snap…t for gnome-42-2204, revision 132.
OK: Mounted var-lib-snapd-snap…t for gnome-42-2204, revision 141.
OK: Mounted var-lib-snapd-snap… gtk-common-themes, revision 1535.
OK: Mounted var-lib-snapd-snap…ount unit for htop, revision 3758.
OK: Mounted var-lib-snapd-snap…ount unit for htop, revision 3873.
OK: Mounted var-lib-snapd-snap…llij-idea-community, revision 456.
OK: Mounted var-lib-snapd-snap…llij-idea-community, revision 460.
OK: Mounted var-lib-snapd-snap…-frameworks-5-core18, revision 32.
OK: Mounted var-lib-snapd-snap…-frameworks-5-core18, revision 35.
OK: Mounted var-lib-snapd-snap…ount unit for ksnip, revision 443.
OK: Mounted var-lib-snapd-snap…ount unit for ksnip, revision 488.
OK: Mounted var-lib-snapd-snap…unit for riseup-vpn, revision 179.
OK: Mounted var-lib-snapd-snap…nt unit for snapd, revision 20092.
OK: Mounted var-lib-snapd-snap…nt unit for snapd, revision 20290.
OK: Mounted var-lib-snapd-snap…ount unit for webots, revision 24.
OK: Mounted var-lib-snapd-snap…ount unit for webots, revision 25.
OK: Mounted var-lib-snapd-snap…nit for zoom-client, revision 208.
OK: Mounted var-lib-snapd-snap…nit for zoom-client, revision 210.
OK: Finished systemd-fsck@dev-…a5188-f6a0-4588-9287-9b72a7cd1710.
OK: Finished systemd-fsck@dev-…ck on /dev/disk/by-uuid/B865-4EC4.
__: Starting modprobe@dm_mod.s…[0m - Load Kernel Module dm_mod...
__: Starting modprobe@loop.ser…e - Load Kernel Module loop...
OK: Finished modprobe@dm_mod.s…e - Load Kernel Module dm_mod.
OK: Finished modprobe@loop.service - Load Kernel Module loop.
__: Mounting boot.mount - /boot...
OK: Mounted boot.mount - /boot.
__: Mounting boot-efi.mount - /boot/efi...
OK: Mounted boot-efi.mount - /boot/efi.
OK: Reached target local-fs.target - Local File Systems.
__: Starting import-state.serv…rk configuration from initramfs...
__: Starting plymouth-read-wri…mouth To Write Out Runtime Data...
__: Starting systemd-binfmt.se…et Up Additional Binary Formats...
__: Starting systemd-boot-upda… - Automatic Boot Loader Update...
__: Mounting proc-sys-fs-binfm…utable File Formats File System...
OK: Finished systemd-boot-upda…0m - Automatic Boot Loader Update.
OK: Finished plymouth-read-wri…lymouth To Write Out Runtime Data.
OK: Mounted proc-sys-fs-binfmt…ecutable File Formats File System.
OK: Finished systemd-binfmt.se… Set Up Additional Binary Formats.
OK: Finished import-state.serv…work configuration from initramfs.
__: Starting systemd-tmpfiles-… Volatile Files and Directories...
OK: Finished systemd-tmpfiles-…te Volatile Files and Directories.
__: Mounting var-lib-nfs-rpc_p…ount - RPC Pipe File System...
__: Starting auditd.service - Security Auditing Service...
__: Starting systemd-oomd.serv…pace Out-Of-Memory (OOM) Killer...
__: Starting systemd-resolved.…e - Network Name Resolution...
__: Starting systemd-userdbd.s…ice - User Database Manager...
OK: Started auditd.service - Security Auditing Service.
__: Starting systemd-update-ut…rd System Boot/Shutdown in UTMP...
OK: Started systemd-userdbd.service - User Database Manager.
OK: Finished systemd-update-ut…cord System Boot/Shutdown in UTMP.
OK: Mounted var-lib-nfs-rpc_pi….mount - RPC Pipe File System.
OK: Reached target rpc_pipefs.target.
OK: Started systemd-oomd.servi…rspace Out-Of-Memory (OOM) Killer.
OK: Started systemd-resolved.s…ice - Network Name Resolution.
OK: Reached target nss-lookup.…m - Host and Network Name Lookups.
OK: Reached target sysinit.target - System Initialization.
OK: Started cups.path - CUPS Scheduler.
OK: Started dnf-makecache.timer - dnf makecache --timer.
OK: Started fstrim.timer - Discard unused blocks once a week.
OK: Started logrotate.timer - Daily rotation of log files.
for snappy daemon.
OK: Reached target sockets.target - Socket Units.
(SMART) Daemon...vi… - D-Bus System Message Bus...
OK: Reached target nss-user-lo…[0m - User and Group Name Lookups.
__: Starting accounts-daemon.service - Accounts Service...
__: Starting systemd-logind.se…ice - User Login Management...re).
__: Starting udisks2.service - Disk Manager...
__: Starting upower.service - Daemon for power management....
OK: Started rsyslog.service - System Logging Service. shutdown...
OK: Finished dracut-shutdown.s…estore /run/initramfs on shutdown.
OK: Started livesys.serviceSB: Init script for live image..
__: Starting abrtd.service - ABRT Daemon...for live image....
__: Starting chronyd.service - NTP client/server...ing Sensors...
__: Starting livesys-late.serv…ate init script for live image....
OK: Started rtkit-daemon.servi…timeKit Scheduling Policy Service.
OK: Started avahi-daemon.service - Avahi mDNS/DNS-SD Stack.
OK: Started livesys-late.servi… Late init script for live image..
OK: Started smartd.service…porting Technology (SMART) Daemon.e...
OK: Finished lm_sensors.servic…[0m - Hardware Monitoring Sensors.
__: Starting modprobe@drm.service - Load Kernel Module drm...
OK: Finished modprobe@drm.service - Load Kernel Module drm.
OK: Started systemd-logind.service - User Login Management.
OK: Started polkit.service - Authorization Manager.
__: Starting ModemManager.service - Modem Manager...
__: Starting bolt.service - Thunderbolt system service...
__: Starting firewalld.service…walld - dynamic firewall daemon...
__: Starting bluetooth.service - Bluetooth service...
OK: Started chronyd.service - NTP client/server.
OK: Started bolt.service - Thunderbolt system service.
OK: Started upower.service - Daemon for power management.
OK: Started accounts-daemon.service - Accounts Service.
OK: Started bluetooth.service - Bluetooth service.
OK: Reached target bluetooth.target - Bluetooth Support.
OK: Started udisks2.service - Disk Manager.
__: Starting systemd-hostnamed.service - Hostname Service...
OK: Started ModemManager.service - Modem Manager.
OK: Started systemd-hostnamed.service - Hostname Service.
OK: Started firewalld.serviceewalld - dynamic firewall daemon.
OK: Reached target network-pre…get - Preparation for Network.
__: Starting NetworkManager.service - Network Manager...
OK: Started NetworkManager.service - Network Manager.
OK: Reached target network.target - Network.
__: Starting NetworkManager-wa…m - Network Manager Wait Online...
__: Starting containerd.servic… - containerd container runtime...
__: Starting cups.service - CUPS Scheduler...
__: Starting gssproxy.service - GSSAPI Proxy Daemon...
OK: Started snap.cups.cups-bro…nap application cups.cups-browsed.
OK: Started snap.cups.cupsd.se…e for snap application cups.cupsd.
__: Starting NetworkManager-di…nager Script Dispatcher Service...
OK: Started NetworkManager-dis…Manager Script Dispatcher Service.
OK: Started gssproxy.service - GSSAPI Proxy Daemon.
OK: Reached target nfs-client.target - NFS client services.
__: Starting colord.servicell and Generate Color Profiles...
OK: Started colord.service…stall and Generate Color Profiles.
OK: Started containerd.service…0m - containerd container runtime.
OK: Started cups.service - CUPS Scheduler.
OK: Started abrtd.service - ABRT Daemon.
OK: Started abrt-journal-core.… ABRT coredumpctl message creator.
OK: Started abrt-oops.service - ABRT kernel log watcher.
OK: Started abrt-xorg.service - ABRT Xorg log watcher.
__: Starting wpa_supplicant.service - WPA supplicant...
OK: Started wpa_supplicant.service - WPA supplicant.
OK: Finished powertop.service - PowerTOP autotuner.
OK: Finished NetworkManager-wa…[0m - Network Manager Wait Online.
OK: Reached target network-online.target - Network is Online.
__: Starting docker.servicer Application Container Engine...
OK: Reached target remote-fs-p…eparation for Remote File Systems.
OK: Reached target remote-fs.target - Remote File Systems.
__: Starting rpc-statd-notify.…- Notify NFS peers of a restart...
__: Starting systemd-user-sess…vice - Permit User Sessions...
OK: Started rpc-statd-notify.s…m - Notify NFS peers of a restart.
OK: Finished systemd-user-sess…ervice - Permit User Sessions.
OK: Started atd.service - Deferred execution scheduler.
OK: Started crond.service - Command Scheduler.
__: Starting plymouth-quit-wai… until boot process finishes up...
__: Starting plymouth-quit.ser… Terminate Plymouth Boot Screen...
`
	.trim()
	.split("\n");
