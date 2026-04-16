export type FormType = 'subscription' | 'get_in_touch' | 'message' | 'contact';

export type SubscriptionFormData = {
  email: string;
};

export type GetInTouchFormData = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  message: string;
};

export type MessageFormData = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  message: string;
};

export type ContactFormData = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  companyName: string;
  websiteUrl: string;
  jobFunction: string;
  jobTitle: string;
  countryRegion: string;
  interestedIn: string;
  interestedProduct: string;
  interestedMarketingSupportService: string;
  interestedTechnicalSupportService: string;
  message: string;
};

export type FormDataByType = {
  subscription: SubscriptionFormData;
  get_in_touch: GetInTouchFormData;
  message: MessageFormData;
  contact: ContactFormData;
};

export type FormSubmitRequest<T extends FormType = FormType> = {
  formType: T;
  data: FormDataByType[T];
};

export type FormSubmitError = {
  ok: false;
  message: string;
  fieldErrors?: Record<string, string>;
};

export type FormSubmitSuccess = {
  ok: true;
  data?: unknown;
};

export type FormSubmitResult = FormSubmitSuccess | FormSubmitError;
