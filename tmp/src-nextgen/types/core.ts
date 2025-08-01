export interface BaseComponentProps {
  testID?: string;
  style?: any;
  children?: React.ReactNode;
}

export interface FormData {
  [key: string]: string | number | boolean;
}

export interface FormErrors {
  [key: string]: string[];
}

export interface FormWarnings {
  [key: string]: string[];
}

export interface FormState<T extends FormData> {
  data: T;
  errors: FormErrors;
  warnings: FormWarnings;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationParams;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
  progress?: number;
}

export interface ModalState {
  isVisible: boolean;
  title?: string;
  content?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
} 