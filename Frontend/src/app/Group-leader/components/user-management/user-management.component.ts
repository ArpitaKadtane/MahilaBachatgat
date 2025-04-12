import { Component, OnInit } from '@angular/core';
import { GroupLeaderService } from '../../services/Group-leader.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../../../authentication/components/footer/footer.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  pendingRequests: any[] = [];
  approvedMembers: any[] = [];

  constructor(
    private groupLeaderService: GroupLeaderService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadPendingRequests();
    this.loadApprovedMembers();
  }
  loadPendingRequests() {
    this.groupLeaderService.getPendingRequests().subscribe({
      next: (res) => {
        console.log('Pending requests:', res); // Check the structure of the response
        this.pendingRequests = res;
      },
      error: (err) => {
        console.error('Error fetching pending requests:', err); // Log the actual error response
        alert('❌ सदस्य विनंत्या मिळवण्यात अडचण आली.');
      },
    });
  }
  loadApprovedMembers() {
    this.groupLeaderService.getApprovedMembers().subscribe({
      next: (res) => {
        console.log('Approved members:', res); // Log for debugging
        this.approvedMembers = res;
      },
      error: (err) => {
        console.error('Error fetching approved members:', err); // Log the actual error response
        alert('❌ मंजूर सदस्य मिळवण्यात अडचण आली.');
      },
    });
  }
  approveRequest(id: number) {
    console.log('Approving member with ID:', id); // Debugging line
    if (!id) {
      console.error('Request ID is undefined');
      return; // Avoid calling the API if ID is missing
    }

    this.groupLeaderService.approveRequest(id).subscribe({
      next: (response) => {
        console.log('Response from server:', response); // Debugging line
        alert('✅ सदस्य मंजूर झाला!');

        // Move the approved request to the approved members list
        const approvedRequest = this.pendingRequests.find(
          (request) => request.id === id
        );

        if (approvedRequest) {
          this.approvedMembers.push(approvedRequest);
          this.pendingRequests = this.pendingRequests.filter(
            (request) => request.id !== id
          );
        }
      },
      error: (error) => {
        console.error('Error response:', error); // Debugging line
        alert('❌ मंजुरी करताना त्रुटी आली.');
      },
    });
  }
  rejectRequest(id: number) {
    console.log('Rejecting member with ID:', id); // Debugging line
    if (!id) {
      console.error('Request ID is undefined');
      return; // Avoid calling the API if ID is missing
    }

    this.groupLeaderService.rejectRequest(id).subscribe({
      next: (response) => {
        console.log('Response from server:', response); // Debugging line
        alert('❌ सदस्य नकारला गेला.');
        this.loadPendingRequests(); // Refresh pending requests after rejection
      },
      error: (error) => {
        console.error('Error response:', error); // Debugging line
        if (error.error) {
          console.error('Error details:', error.error); // Log additional error details
        }
        alert('❌ नकार करताना त्रुटी आली.');
      },
    });
  }
  removeMember(member_id: number): void {
    console.log('📋 Approved members:', this.approvedMembers);

    if (!member_id) {
      console.error('❌ Member ID is missing');
      return;
    }

    this.groupLeaderService.removeMember(member_id).subscribe({
      next: (res) => {
        console.log('✅ Member removed:', res);
        this.loadApprovedMembers();
      },
      error: (err) => {
        console.error('❌ Error removing member:', err);
      },
    });
  }
}
