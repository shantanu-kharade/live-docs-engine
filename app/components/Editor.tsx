'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import { HocuspocusProvider } from '@hocuspocus/provider' // You need to install this: npm i @hocuspocus/provider
import { useEffect, useState } from 'react'

export default function Editor({ docId }: { docId: string }) {
  // 1. Setup the Sync Provider
  const [provider, setProvider] = useState<HocuspocusProvider | null>(null)

  useEffect(() => {
    const ydoc = new Y.Doc()
    
    const newProvider = new HocuspocusProvider({
      url: 'ws://localhost:1234',
      name: docId, // This matches 'documentName' in the server file
      document: ydoc,
    })

    setProvider(newProvider)

    return () => {
      newProvider.destroy() // Cleanup connection on unmount
    }
  }, [docId])

  // 2. Setup Tiptap
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }), // Disable local history (let Yjs handle it)
      Collaboration.configure({
        document: provider?.document,
      }),
    ],
  }, [provider]) // Re-create editor when provider is ready

  if (!editor || !provider) return <div>Loading...</div>

  return <EditorContent editor={editor} className="border p-4 rounded-lg min-h-[500px]" />
}