import { useState, useRef, useEffect } from 'react'
import { IconChevronDown } from '../icons/Icons'

export default function CustomSelect({ value, options, onChange, className }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(opt => opt.value === value) || options[0]

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-chat-surface border border-chat-border text-chat-text-main rounded-xl focus:ring-1 focus:ring-chat-text-muted focus:border-chat-text-muted flex items-center justify-between p-3 outline-none transition-colors hover:bg-[#3f3f3f]"
      >
        <span className="truncate pr-4">{selectedOption?.label}</span>
        <IconChevronDown className="w-4 h-4 text-chat-text-muted shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-chat-surface border border-chat-border rounded-xl shadow-lg overflow-hidden py-1">
          <ul className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`px-3 py-2.5 cursor-pointer text-sm transition-colors hover:bg-[#3f3f3f] ${
                  value === option.value ? 'bg-[#3f3f3f] text-white font-medium' : 'text-chat-text-main'
                }`}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
