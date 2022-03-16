export interface IDataAssignmentProps {
  comments: string;
  orderId: string;
  addDateRow: () => void;
  preferredDates: any[];
  deletePreferredDate: (i: number) => void;
  onChangeComments: (e: string) => void;
  onChangeSelectedDate: (e: any, i: number) => void;
  onChangeSelectedOption: (e: string) => void;
  onChangeSelectedTime: (e: string, i: number) => void;
  onChangeSelectedPaymentOption: (e: number) => void;
  selectedOption: string;
  optionList: any[];
  paymentOptionList: any[];
  deliveryOption: string;
  delivery_option_id: string;
  selectedPaymentOption: number;
  times?: any;
  selectedDates?: any;
  onDateClick?: (e: any, index: number) => void;
  isLoading?: Boolean;
}
