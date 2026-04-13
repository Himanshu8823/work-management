import * as React from "react";
import { CheckIcon } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/helpers";

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    ({ className, onChange, value, ...props }, ref) => {
      return (
        <RPNInput.default
          ref={ref}
          className={cn("flex", className)}
          flagComponent={FlagComponent}
          countrySelectComponent={CountrySelect}
          inputComponent={InputComponent}
          smartCaret={false}
          value={value || undefined}
          onChange={(value) => onChange?.(value || ("" as RPNInput.Value))}
          {...props}
        />
      );
    },
  );
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <Input
    className={cn("rounded-e-lg rounded-s-none", className)}
    {...props}
    ref={ref}
  />
));
InputComponent.displayName = "InputComponent";

type CountryEntry = { label: string; value: RPNInput.Country | undefined };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  options: CountryEntry[];
  onChange: (country: RPNInput.Country) => void;
};

const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        className="flex gap-1 rounded-e-none rounded-s-lg border-r-0 px-3"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FlagComponent
          country={selectedCountry}
          countryName={selectedCountry}
        />
      </Button>
      
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto w-60">
          <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
            <input
              type="text"
              placeholder="Search country..."
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              onChange={(e) => {
                // Filter logic can be added later
              }}
            />
          </div>
          <div>
            {countryList.map(({ value, label }) =>
              value ? (
                <button
                  key={value}
                  type="button"
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 transition-colors text-left",
                    value === selectedCountry && "bg-blue-50"
                  )}
                  onClick={() => {
                    onChange(value);
                    setIsOpen(false);
                  }}
                >
                  <FlagComponent country={value} countryName={label} />
                  <span className="flex-1">{label}</span>
                  <span className="text-gray-500 text-xs">{`+${RPNInput.getCountryCallingCode(value)}`}</span>
                  {value === selectedCountry && (
                    <CheckIcon className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};

export { PhoneInput };
