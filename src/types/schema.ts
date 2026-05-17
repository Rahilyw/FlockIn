export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  interests: string[];      // e.g., ['tech', 'wellness']
  savedEvents: string[];    // Array of eventIds
  attendingEvents: string[];// Array of eventIds
  joinedClubs: string[];    // Array of clubIds
  createdAt: any;           // Firestore Timestamp
  updatedAt: any;           // Firestore Timestamp
}

export interface Club {
  id: string;
  name: string;
  description: string;
  createdBy: string;          // uid of the creator
  categories: string[];     // Lowercase to match user interests 
  website: string;
  memberCount: number;
  logoUrl: string;
  socialLinks: {
    discord?: string;
    instagram?: string;
    linkedin?: string;
  };
  createdAt: any;           // Firestore Timestamp
  updatedAt: any;           // Firestore Timestamp
}

export interface Event {
  id: string;
  title: string;
  description: string;
  clubId: string;           // Matches database
  createdBy: string;        // Matches database
  isPublic: boolean;
  location: string; 
  startTime: any;           // Firestore Timestamp
  endTime: any;             // Firestore Timestamp
  status: 'upcoming' | 'ongoing' | 'completed'; // Matches database
  capacity: number;         // Matches database
  attendeeCount: number;    // Matches database
  tags: string[];           // Lowercase tags array
  poster: {
    url: string;
    fileName: string;       // Fixed camelCase
    fileType: string;       // Fixed camelCase
  };
  createdAt: any;           // Firestore Timestamp
  updatedAt?: any;          // Optional backup timestamp
}

export interface CampusResource {
  id: string;
  title: string;            // Matches database (instead of 'name')
  description: string;
  location: string;         // Matches database (e.g., "University of Victoria")
  contactInfo: string;      // Matches database
  availability: string;     // Matches database (e.g., hours of operation)
  imageUrl: string;         // Matches database
  tags: string[];           // Lowercase interest tags array
  createdAt: any;           // Firestore Timestamp
  updatedAt: any;           // Firestore Timestamp
}