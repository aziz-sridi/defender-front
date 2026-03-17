'use client'

import { useState, useEffect, useRef } from 'react'

import Button from '@/components/ui/Button'
import { emojiCategories } from '@/data/emojis'

interface TextEditorProps {
  content: string
  onContentChange: (content: string) => void
}

const TextEditor = ({ content, onContentChange }: TextEditorProps) => {
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const savedRangeRef = useRef<Range | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const linkInputRef = useRef<HTMLInputElement>(null)

  const formatText = (command: string) => {
    document.execCommand(command, false, undefined)
    setIsBold(document.queryCommandState('bold'))
    setIsItalic(document.queryCommandState('italic'))
    setIsUnderline(document.queryCommandState('underline'))
  }

  const insertList = (ordered: boolean) => {
    const selection = window.getSelection()
    if (!selection || !editorRef.current) {
      return
    }

    try {
      const range = selection.getRangeAt(0)

      if (!range.collapsed) {
        const selectedText = range.toString()
        const lines = selectedText.split('\n').filter(line => line.trim() !== '')

        let listText = ''
        if (lines.length === 0) {
          listText = ordered ? '1. List item' : '• List item'
        } else {
          listText = lines
            .map((line, index) => {
              const trimmedLine = line.trim()
              return ordered ? `${index + 1}. ${trimmedLine}` : `• ${trimmedLine}`
            })
            .join('\n')
        }

        range.deleteContents()
        const textNode = document.createTextNode(listText)
        range.insertNode(textNode)

        const newRange = document.createRange()
        newRange.setStartAfter(textNode)
        newRange.collapse(true)
        selection.removeAllRanges()
        selection.addRange(newRange)
      } else {
        const listText = ordered ? '1. List item' : '• List item'
        const textNode = document.createTextNode(listText)
        range.insertNode(textNode)

        const newRange = document.createRange()
        const prefixLength = ordered ? 3 : 2
        newRange.setStart(textNode, prefixLength)
        newRange.setEnd(textNode, textNode.textContent?.length || 0)
        selection.removeAllRanges()
        selection.addRange(newRange)
      }

      handleContentChange()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error inserting list:', error)
      const listText = ordered ? '1. List item' : '• List item'
      if (editorRef.current) {
        const currentContent = editorRef.current.innerHTML
        editorRef.current.innerHTML = currentContent + '<br>' + listText
        handleContentChange()
      }
    }
  }

  const openLinkInput = () => {
    // Save current selection to restore when applying the link
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      try {
        savedRangeRef.current = selection.getRangeAt(0).cloneRange()
      } catch {
        savedRangeRef.current = null
      }
    }
    setShowLinkInput(true)
    // Focus the input on next tick
    setTimeout(() => linkInputRef.current?.focus(), 0)
  }

  const applyLink = () => {
    const url = linkUrl.trim()
    if (!url) {
      setShowLinkInput(false)
      return
    }

    // Normalize URL (add https:// if missing protocol)
    const normalizedUrl = /^(https?:)?\/\//i.test(url) ? url : `https://${url}`

    // Restore saved selection or place caret at end
    const selection = window.getSelection()
    selection?.removeAllRanges()
    if (savedRangeRef.current) {
      selection?.addRange(savedRangeRef.current)
    } else if (editorRef.current) {
      const range = document.createRange()
      range.selectNodeContents(editorRef.current)
      range.collapse(false)
      selection?.addRange(range)
    }

    try {
      document.execCommand('createLink', false, normalizedUrl)
    } catch {
      // no-op
    }

    setShowLinkInput(false)
    setLinkUrl('')
    savedRangeRef.current = null
    handleContentChange()
  }

  const cancelLink = () => {
    setShowLinkInput(false)
    setLinkUrl('')
    savedRangeRef.current = null
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const insertEmoji = (emoji: string) => {
    if (!editorRef.current) {
      return
    }

    editorRef.current.focus()

    const selection = window.getSelection()
    if (!selection) {
      return
    }

    try {
      let range: Range

      if (selection.rangeCount === 0 || !editorRef.current.contains(selection.anchorNode)) {
        range = document.createRange()
        range.selectNodeContents(editorRef.current)
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
      } else {
        range = selection.getRangeAt(0)
      }

      const textNode = document.createTextNode(emoji)
      range.deleteContents()
      range.insertNode(textNode)

      const newRange = document.createRange()
      newRange.setStartAfter(textNode)
      newRange.collapse(true)
      selection.removeAllRanges()
      selection.addRange(newRange)
      setShowEmojiPicker(false)
      handleContentChange()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error inserting emoji:', error)
      if (editorRef.current) {
        const currentContent = editorRef.current.innerHTML
        editorRef.current.innerHTML = currentContent + emoji

        const range = document.createRange()
        const selection = window.getSelection()
        range.selectNodeContents(editorRef.current)
        range.collapse(false)
        selection?.removeAllRanges()
        selection?.addRange(range)

        setShowEmojiPicker(false)
        handleContentChange()
      }
    }
  }

  const handleContentChange = () => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML
      onContentChange(htmlContent)
    }
  }

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content
    }
  }, [content])

  return (
    <div className="bg-defendrBg rounded-lg border border-defendrGrey">
      <div className="flex items-center gap-2 p-3 border-b border-defendrGrey">
        <Button
          className="!w-auto !h-auto !p-2"
          label="B"
          size="xxxs"
          textClassName="font-bold"
          variant={isBold ? 'contained-ghostRed' : 'outlined-grey'}
          onClick={() => formatText('bold')}
        />

        <Button
          className="!w-auto !h-auto !p-2"
          label="I"
          size="xxxs"
          textClassName="italic"
          variant={isItalic ? 'contained-ghostRed' : 'outlined-grey'}
          onClick={() => formatText('italic')}
        />

        <Button
          className="!w-auto !h-auto !p-2"
          label="U"
          size="xxxs"
          textClassName="underline"
          variant={isUnderline ? 'contained-ghostRed' : 'outlined-grey'}
          onClick={() => formatText('underline')}
        />

        <Button
          className="!w-auto !h-auto !p-2"
          label="S"
          size="xxxs"
          textClassName="line-through"
          variant="outlined-grey"
          onClick={() => formatText('strikeThrough')}
        />

        <div className="w-px h-6 bg-defendrGrey mx-2" />

        <Button
          className="!w-auto !h-auto !p-2"
          label="• List"
          size="xxs"
          variant="outlined-grey"
          onClick={() => insertList(false)}
        />

        <Button
          className="!w-auto !h-auto !p-2"
          label="1. List"
          size="xxs"
          variant="outlined-grey"
          onClick={() => insertList(true)}
        />

        <div className="relative inline-block">
          <Button
            className="!w-auto !h-auto !p-2"
            label="🔗"
            size="xxxs"
            variant="outlined-grey"
            onClick={openLinkInput}
          />

          {showLinkInput && (
            <div className="absolute top-full left-0 mt-2 bg-defendrLightBlack border border-defendrGrey rounded-lg shadow-lg z-50 p-2 w-72">
              <div className="flex items-center gap-2">
                <input
                  ref={linkInputRef}
                  className="flex-1 bg-transparent outline-none border border-defendrGrey rounded px-2 py-1 text-white text-sm"
                  placeholder="https://example.com"
                  type="url"
                  value={linkUrl}
                  onChange={e => setLinkUrl(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      applyLink()
                    } else if (e.key === 'Escape') {
                      cancelLink()
                    }
                  }}
                />
                <Button
                  className="!w-auto !h-auto !px-2 !py-1"
                  label="Add"
                  size="xxxs"
                  variant="contained-ghostRed"
                  onClick={applyLink}
                />
                <Button
                  className="!w-auto !h-auto !px-2 !py-1"
                  label="Cancel"
                  size="xxxs"
                  variant="outlined-grey"
                  onClick={cancelLink}
                />
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-defendrGrey mx-2" />

        <div className="relative">
          <Button
            className="!w-auto !h-auto !p-2"
            label="😀"
            size="xxxs"
            variant={showEmojiPicker ? 'contained-ghostRed' : 'outlined-grey'}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          />

          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute top-full left-0 mt-2 bg-defendrLightBlack border border-defendrGrey rounded-lg shadow-lg z-50 w-80 max-h-96 overflow-y-auto"
            >
              {Object.entries(emojiCategories).map(([category, emojis]) => (
                <div key={category} className="p-3">
                  <h4 className="text-white font-poppins text-xs font-medium mb-2 border-b border-defendrGrey pb-1">
                    {category}
                  </h4>
                  <div className="grid grid-cols-8 gap-1">
                    {emojis.map((emoji, index) => (
                      <button
                        key={`${category}-${index}`}
                        className="w-8 h-8 flex items-center justify-center text-lg hover:bg-defendrRed hover:rounded transition-colors"
                        title={emoji}
                        onClick={() => insertEmoji(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-defendrGrey mx-2" />

        <Button
          className="!w-auto !h-auto !p-2"
          label="⬅"
          size="xxxs"
          variant="outlined-grey"
          onClick={() => formatText('justifyLeft')}
        />

        <Button
          className="!w-auto !h-auto !p-2"
          label="↔"
          size="xxxs"
          variant="outlined-grey"
          onClick={() => formatText('justifyCenter')}
        />

        <Button
          className="!w-auto !h-auto !p-2"
          label="➡"
          size="xxxs"
          variant="outlined-grey"
          onClick={() => formatText('justifyRight')}
        />
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="min-h-[400px] p-4 text-white focus:outline-none prose prose-invert max-w-none"
        data-placeholder="Write your tournament rules here..."
        style={{
          wordWrap: 'break-word',
        }}
        onBlur={handleContentChange}
        onInput={handleContentChange}
      />

      <style jsx>{`
        div[contenteditable]:empty::before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }

        div[contenteditable] {
          line-height: 1.6;
        }
      `}</style>
    </div>
  )
}
export default TextEditor
