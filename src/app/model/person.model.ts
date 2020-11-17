export interface Person {
  id: string;
  photo: string;
  firstname: string;
  lastname: string;
  entity: string;
  entryDate: string;
  birthDate: string;
  gender: string;
  email: string;
  skills: string[];
  phone: string;
  isManager: boolean;
  manager: string;
  managerId: string;
  geo: {
    lat: number;
    lng: number;
  };
  address: {
    street: string;
    postalCode: number;
    city: string;
  };
  links: {
    twitter: string;
    slack: string;
    github: string;
    linkedin: string;
  };
}
