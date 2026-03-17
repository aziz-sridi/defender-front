interface SelectRoleProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  className?: string
}

const SelectRole: React.FC<SelectRoleProps> = ({ value, onChange, className }) => (
  <div className="relative">
    <select
      className={`w-full bg-[#312f31] border-0 rounded-full p-3 text-white appearance-none pr-8 font-poppins ${className || ''}`}
      value={value}
      onChange={onChange}
    >
      <option className="sm:text-sm text-xs" value="Member">
        Member
      </option>
      <option className="sm:text-sm text-xs" value="Coach">
        Coach
      </option>
      <option className="sm:text-sm text-xs" value="Captain">
        Captain
      </option>
      <option className="sm:text-sm text-xs" value="Substitute">
        Substitute
      </option>
    </select>
    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    </div>
  </div>
)

export default SelectRole
