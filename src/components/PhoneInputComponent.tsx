import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

export default function PhoneInputComponent({ ...props }) {
  return (
    <div className="flex flex-col grow">
      <div className="relative w-full inline-flex tap-highlight-transparent shadow-sm px-3 border-medium border-default-200 data-[hover=true]:border-default-400 group-data-[focus=true]:border-default-foreground min-h-10 rounded-medium flex-col items-start justify-center gap-0 !duration-150 transition-colors motion-reduce:transition-none h-14 py-2">
        <label className="text-xs text-foreground-500">
          {props?.placeholder}
        </label>
        <PhoneInput {...props} />
      </div>
      {props?.errors && props?.touched ? (
        <div className="p-2 text-xs bg-errorTint border rounded mt-1 animate-pulse border-error text-error">
          {props?.errors}
        </div>
      ) : null}
    </div>
  );
}
