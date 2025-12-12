import { ChevronDown, Check } from "@untitledui/icons";
import { Dropdown } from "./dropdown";
import { Button } from "../buttons/Button";

interface DropdownButtonProps {
  placeholder?: string;
  label: Record<string, string>;
  value?: string | null;
  onChange?: (value: string) => void;
  className?: string;
}

export const DropdownButton = ({
  placeholder,
  label,
  value,
  onChange,
  className,
}: DropdownButtonProps) => {
  const selectedLabel = (value && label[value]) || placeholder;

  return (
    <Dropdown>
      <Button
        className={`group py-2 px-3 rounded-lg flex justify-between ${className}`}
        color="secondary"
        iconTrailing={<ChevronDown size={16} />}
      >
        {selectedLabel}
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu>
          <Dropdown.Section>
            {Object.entries(label).map(([key, itemLabel]) => (
              <Dropdown.Item
                key={key}
                id={key}
                onClick={() => {
                  onChange?.(key);
                }}
                icon={value === key ? Check : undefined}
              >
                {itemLabel}
              </Dropdown.Item>
            ))}
          </Dropdown.Section>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};
