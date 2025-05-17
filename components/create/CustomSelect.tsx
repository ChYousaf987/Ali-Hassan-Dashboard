'use client';

import CreatableSelect from 'react-select/creatable';

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    onChange: (option: Option | null) => void;
    value: Option | null;
    options: Option[];
    label: string;
    placeholder: string;
    disabled?: boolean;
}

export const CustomSelect: React.FC<SelectProps> = ({ onChange, value, options, label, placeholder, disabled }) => {
    const handleCreateOption = (inputValue: string) => {
        const newOption: Option = {
            value: inputValue.toLowerCase().replace(/\s+/g, '-'),
            label: inputValue,
        };
        onChange(newOption);
    };

    return (
        <div className="flex flex-col">
            <label htmlFor="category" className="font-semibold text-[0.8rem] text-neutral-500 w-full">
                {label}
            </label>
            <CreatableSelect
                options={options}
                isDisabled={disabled}
                onChange={onChange}
                onCreateOption={handleCreateOption}
                isSearchable
                value={value}
                placeholder={placeholder}
                classNames={{
                    option: (state) => `py-2 px-4 cursor-pointer rounded-md ${state.isFocused ? 'bg-neutral-100' : ''} ${state.isSelected ? 'bg-blue-100 text-blue-700' : ''}`,
                    control: () => 'text-[0.9rem] font-manrope',
                    menu: () => 'bg-white rounded-md shadow-lg',
                }}
                styles={{
                    control: (baseStyles, state) => ({
                        ...baseStyles,
                        border: '1px solid #11111133',
                        borderRadius: '12px',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: state.isDisabled ? '#f5f5f5' : 'white',
                        color: state.isDisabled ? '#B3B0B0' : '#0E1726',
                        boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
                        '&:hover': {
                            borderColor: '#3b82f6',
                        },
                    }),
                    menu: (baseStyles) => ({
                        ...baseStyles,
                        zIndex: 9999,
                        marginTop: '4px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '10px',
                        backgroundColor: 'white',
                    }),
                    menuList: (baseStyles) => ({
                        ...baseStyles,
                        padding: '8px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                    }),
                    option: (baseStyles) => ({
                        ...baseStyles,
                        fontSize: '0.9rem',
                        color: '#0E1726',
                    }),
                    placeholder: (baseStyles) => ({
                        ...baseStyles,
                        fontSize: '0.8rem',
                        color: '#B0B0B0',
                        fontFamily: 'Manrope, sans-serif',
                    }),
                }}
            />
        </div>
    );
};
