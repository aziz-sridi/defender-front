'use client'
import { useEffect, useState } from 'react'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Inputs'
import Typo from '@/components/ui/Typo'
import { getAllUsers } from '@/services/userService'

interface NewMember {
  name: string
  userId: string
  role: string
  message: string
}

interface AddMemberModalProps {
  newMember: NewMember
  setNewMember: (member: NewMember) => void
  onSave: () => void
  onCancel: () => void
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  newMember,
  setNewMember,
  onSave,
  onCancel,
}) => {
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await getAllUsers()
      setUsers(allUsers)
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredUsers([])
    } else {
      setFilteredUsers(
        users.filter(user =>
          (user.nickname || user.fullname || '').toLowerCase().startsWith(search.toLowerCase()),
        ),
      )
    }
  }, [search, users])

  const handleSelectUser = (user: any) => {
    setNewMember({
      ...newMember,
      userId: user._id,
      name: user.nickname || user.fullname || '',
    })
    setSearch(user.nickname || user.fullname || '')
    setShowSuggestions(false)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-defendrBg rounded-xl p-6 sm:p-8 w-full max-w-md mx-4">
        <Typo className=" text-lg sm:text-2xl mb-4" fontFamily="poppins" fontVariant="p1">
          Invite New Member
        </Typo>

        <div className="mb-6 relative">
          <Typo
            className="text-gray-400 text-sm mb-4 font-poppins"
            fontFamily="poppins"
            fontVariant="p1"
          >
            Send an invitation to join your organization.
          </Typo>
          <Typo
            className="block text-white text-sm mb-2 font-poppins"
            fontFamily="poppins"
            fontVariant="p1"
          >
            Search User
          </Typo>
          <Input
            backgroundColor="#312f31"
            className="w-full border-0 rounded-full p-3 text-white font-poppins"
            placeholder="Type a name..."
            value={search}
            onChange={(val: string) => {
              setSearch(val)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          {showSuggestions && filteredUsers.length > 0 && (
            <ul className="absolute w-full bg-[#312f31] mt-1 rounded-xl shadow-lg max-h-40 overflow-y-auto z-10">
              {filteredUsers.map(user => (
                <li
                  key={user._id}
                  className="px-4 py-2 hover:bg-[#444] cursor-pointer text-white font-poppins"
                  onClick={() => handleSelectUser(user)}
                >
                  {user.nickname || user.fullname || 'Unknown User'}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-6">
          <Typo className="block text-white text-sm mb-2" fontFamily="poppins">
            Role
          </Typo>
          <div className="relative">
            <select
              className="w-full bg-[#312f31] border-0 rounded-full p-3 text-white appearance-none pr-8 font-poppins"
              value={newMember.role}
              onChange={e => setNewMember({ ...newMember, role: e.target.value })}
            >
              <option value="Admin">Admin</option>
              <option value="Bracket Manager">Bracket Manager</option>
              <option value="Founder">Founder</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 9l-7 7-7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <Typo className="block text-white text-sm mb-2" fontFamily="poppins">
            Personal Message (Optional)
          </Typo>
          <textarea
            className="w-full bg-[#312f31] border-0 rounded-xl p-3 text-white resize-none font-poppins"
            placeholder="We'd like you to join our organization..."
            rows={3}
            value={newMember.message}
            onChange={e => setNewMember({ ...newMember, message: e.target.value })}
          />
        </div>

        <div className="flex justify-center gap-4 mt-auto font-poppins">
          <Button
            className="btn-defendr-grey w-auto"
            label="Cancel"
            size="xxs"
            textClassName="sm:text-sm text-xs"
            variant="outlined-grey"
            onClick={onCancel}
          />
          <Button
            className="btn-defendr-red w-auto"
            label="Send Invitation"
            size="s"
            textClassName="sm:text-sm text-xs"
            variant="contained-red"
            onClick={onSave}
          />
        </div>
      </div>
    </div>
  )
}

export default AddMemberModal
