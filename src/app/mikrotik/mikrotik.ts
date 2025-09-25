import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../shared';

interface MikrotikDevice {
  id: string;   // now required
  host: string;
  username?: string;
  password?: string;
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
        console.error('Failed to load mikrotiks', err);
        this.error = 'Failed to load Mikrotik devices.';
        this.loading = false;
      }
    });
  }

  addDevice(): void {
    if (!this.form.host || !this.form.username || !this.form.password) {
      this.error = 'Host, username and password are required.';
      return;
    }

    const payload = {
      host: this.form.host,
      username: this.form.username,
      password: this.form.password,
      port: this.form.port || 8728,
    };

    this.api.addMikrotik(payload).subscribe({
      next: () => {
        this.form = { id: '', host: '', username: '', password: '', port: 8728 };
        this.loadDevices();
      },
      error: (err) => {
        console.error('Add mikrotik failed', err);
        this.error = 'Failed to add Mikrotik.';
      }
    });
  }

  addBatch(): void {
    const lines = this.batchInput.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (!lines.length) return;

    for (const line of lines) {
      const parts = line.split(',').map(p => p.trim());
      const host = parts[0];
      const username = parts[1] || 'admin';
      const password = parts[2] || '';
      const port = parts[3] ? Number(parts[3]) : 8728;

      if (!host) continue;

      this.api.addMikrotik({ host, username, password, port }).subscribe({
        next: () => this.loadDevices(),
        error: (err) => console.error('Batch add error for', host, err)
      });
    }

    this.batchInput = '';
  }

  removeDevice(id: string): void {
    this.removing[id] = true;

    this.api.removeMikrotik(id).subscribe({
      next: () => {
        delete this.removing[id];
        this.loadDevices();
      },
      error: (err) => {
        console.error('Remove failed', err);
        delete this.removing[id];
        this.error = 'Failed to remove Mikrotik.';
      }
    });
  }

  testDevice(device: MikrotikDevice): void {
    this.testing[device.id] = true;

    this.api.testMikrotik(device.id).subscribe({
      next: (res) => {
        this.testing[device.id] = false;
        device.connected = !!res?.ok;
        this.error = res?.ok ? null : (res.message || 'Test failed');
      },
      error: (err) => {
        console.error('Test connection error', err);
        this.testing[device.id] = false;
        this.error = 'Failed to test connection';
      }
    });
  }
}
