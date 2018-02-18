export interface NgPeople {
  Title: string;
  Name: string;
  Surname: string;
  Alias: string;
  Gin: string;
  Email: string;
  Location: string;
  Photo: {
    Description: string;
    Url: string;
  };
  Modified: Date;
  ModifiedBy: string;
  Created: Date;
  CreatedBy: string;
}
