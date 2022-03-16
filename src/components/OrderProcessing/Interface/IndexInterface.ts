export interface IOrderProcessingProps {
 SelectedDepartment: string
}

export interface IOrderProcessingState {
}

export interface IRootOrderProcessingState {
 department: {
  selectedDepartment: {
   slug: string,
   value: string
  }
 }
}
