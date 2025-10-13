import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../shared';

interface MikrotikDevice {
  id: string;
  host: string;
  username: string;   // remove '?'
  password: string;   // remove '?'
  port?: number;
  connected?: boolean;
}


@Component({
  selector: 'app-mikrotik',
  standalone: true,
  imports: [CommonModule, FormsModule],
   templateUrl: './mikrotik.html',
  styleUrls: ['./mikrotik.css']
})
export class MikrotikComponent implements OnInit {
  devices: MikrotikDevice[] = [];
  loading = false;
  error: string | null = null;

  form: MikrotikDevice = { id: '', host: '', username: '', password: '', port: 8728 };
  batchInput = '';

  testing: Record<string, boolean> = {};
  removing: Record<string, boolean> = {};
  resetting: Record<string, boolean> = {};

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadDevices();
  }

  loadDevices(): void {
    this.loading = true;
    this.error = null;
    this.api.listMikrotiks().subscribe({
      next: (data) => {
        this.devices = data || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load Mikrotik devices.';
        this.loading = false;
      },
    });
  }

  addDevice(): void {
    if (!this.form.host || !this.form.username || !this.form.password) {
      this.error = 'Host, username and password are required.';
      return;
    }

    this.api.addMikrotik(this.form).subscribe({
      next: () => {
        this.form = { id: '', host: '', username: '', password: '', port: 8728 };
        this.loadDevices();
      },
      error: () => (this.error = 'Failed to add Mikrotik.'),
    });
  }

  removeDevice(id: string): void {
    this.removing[id] = true;
    this.api.removeMikrotik(id).subscribe({
      next: () => {
        delete this.removing[id];
        this.loadDevices();
      },
      error: () => {
        delete this.removing[id];
        this.error = 'Failed to remove Mikrotik.';
      },
    });
  }

  testDevice(device: MikrotikDevice): void {
    this.testing[device.id] = true;
    this.api.testMikrotik(device.id).subscribe({
      next: (res) => {
        this.testing[device.id] = false;
        device.connected = !!res.ok;
        this.error = res.ok ? null : res.message || 'Connection failed.';
      },
      error: () => {
        this.testing[device.id] = false;
        this.error = 'Failed to test connection.';
      },
    });
  }

  resetDevice(device: MikrotikDevice): void {
    this.resetting[device.id] = true;
    this.api.resetMikrotik(device.id).subscribe({
      next: (res) => {
        this.resetting[device.id] = false;
        alert(res.message || 'Device reset successful.');
      },
      error: (err) => {
        this.resetting[device.id] = false;
        alert('Reset failed: ' + err.message);
      },
    });
  }
}
