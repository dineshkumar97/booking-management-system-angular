import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';

export type AvailabilityStatus =
  | 'available'
  | 'busy'
  | 'away'
  | 'dnd'
  | 'out_of_office'
  | 'offline';

export type OnlineStatus =
  | 'online'
  | 'offline';

export interface StaffStatusChange {
  staffId: string;
  onlineStatus: OnlineStatus;
  availabilityStatus: AvailabilityStatus;
  lastSeen: string | Date | null;
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;

  private currentStaffId: string | null = null;

  userStatuses = signal<Record<string, AvailabilityStatus>>({});

  constructor() {

    this.socket = io('http://localhost:3000', {
      transports: ['websocket', 'polling'],
      autoConnect: false
    });

    // ==============================
    // SOCKET CONNECT
    // ==============================

    this.socket.on('connect', () => {

      console.log('🟢 SOCKET CONNECTED');
      console.log('Socket ID:', this.socket.id);

      if (this.currentStaffId) {

        this.socket.emit(
          'staff-online',
          this.currentStaffId
        );

      }
    });

    // ==============================
    // SOCKET DISCONNECT
    // ==============================

    this.socket.on('disconnect', (reason) => {

      console.log(
        '🔴 SOCKET DISCONNECTED:',
        reason
      );

      console.log(
        'Current Staff:',
        this.currentStaffId
      );

      // Only update local UI.
      // Backend handles MongoDB + broadcasting.

      if (this.currentStaffId) {

        this.userStatuses.update(current => ({
          ...current,
          [this.currentStaffId!]: 'offline'
        }));

      }

    });

    // ==============================
    // CONNECTION ERROR
    // ==============================

    this.socket.on('connect_error', (error) => {

      console.error(
        '❌ SOCKET CONNECTION ERROR:',
        error.message
      );

    });

    // ==============================
    // STAFF STATUS CHANGED
    // ==============================

    this.socket.on(
      'staff-status-changed',
      (data: StaffStatusChange) => {

        console.log(
          '🔥 STATUS RECEIVED:',
          data
        );

        this.userStatuses.update(current => ({
          ...current,
          [data.staffId]: data.availabilityStatus
        }));

      }
    );
  }

  // ==============================
  // CONNECT
  // ==============================

  connect(): void {

    if (this.socket.connected) {
      return;
    }

    console.log('➡️ Connecting Socket.IO');

    this.socket.connect();
  }

  // ==============================
  // DISCONNECT
  // ==============================

  disconnect(): void {

    if (!this.socket.connected) {
      return;
    }

    console.log(
      '➡️ Disconnecting Socket.IO'
    );

    this.socket.disconnect();
  }

  // ==============================
  // SET STAFF ID
  // ==============================

  setStaffId(staffId: string): void {

    if (!staffId) {
      return;
    }

    this.currentStaffId = staffId;
  }

  // ==============================
  // STAFF ONLINE
  // ==============================

  staffOnline(staffId: string): void {

    if (!staffId) {
      return;
    }

    this.currentStaffId = staffId;

    if (!this.socket.connected) {

      this.socket.once('connect', () => {

        this.socket.emit(
          'staff-online',
          staffId
        );

      });

      return;
    }

    this.socket.emit(
      'staff-online',
      staffId
    );
  }

  // ==============================
  // CHANGE STAFF STATUS
  // ==============================

  changeStaffStatus(
    staffId: string,
    status: AvailabilityStatus
  ): void {

    if (!staffId) {
      return;
    }

    if (!this.socket.connected) {
      console.warn(
        'Socket is not connected'
      );
      return;
    }

    // Update Angular UI immediately

    this.userStatuses.update(current => ({
      ...current,
      [staffId]: status
    }));

    // Send to Node.js

    this.socket.emit(
      'staff-status-change',
      {
        staffId,
        status
      }
    );
  }
}