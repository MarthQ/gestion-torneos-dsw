export interface Content {
  id: string;
  name: string;
  surname: string;
  email: string;
}

export interface Header {
  header: string;
  fieldName: keyof Content;
}
