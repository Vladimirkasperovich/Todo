export type FieldError = {
  field: string;
  error: string;
};

export type BaseResponseType<D = {}> = {
  resultCode: number;
  messages: Array<string>;
  data: D;
  fieldsErrors: FieldError[];
};
