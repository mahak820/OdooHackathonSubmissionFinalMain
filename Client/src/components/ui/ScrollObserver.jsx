// src/components/ScrollObserver.jsx
"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react"

// Create a context to share state between components
const ScrollContext = createContext(null)

// Custom hook to easily access the context
const useScrollContext = () => {
  const context = useContext(ScrollContext)
  if (!context) {
    throw new Error("useScrollContext must be used within a ScrollObserver")
  }
  return context
}

// The main component
export function ScrollObserver({ children, className, as: Component = "div" }) {
  const [activeId, setActiveId] = useState(null)
  const [isHidden, setIsHidden] = useState(false)
  const rootRef = useRef(null)
  const triggerRefs = useRef(new Map())

  const registerTrigger = useCallback((id, ref) => {
    triggerRefs.current.set(id, ref)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        root: null, // viewport
        rootMargin: "-50% 0px -50% 0px", // Fire when element is at the vertical center
        threshold: 0,
      },
    )

    triggerRefs.current.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    // Observer for hiding the initial state
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        setIsHidden(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    if (rootRef.current) {
      visibilityObserver.observe(rootRef.current)
    }

    return () => {
      observer.disconnect()
      visibilityObserver.disconnect()
    }
  }, [])

  return (
    <ScrollContext.Provider value={{ activeId, registerTrigger }}>
      <Component ref={rootRef} className={className}>
        {children(isHidden)}
      </Component>
    </ScrollContext.Provider>
  )
}

// Sub-components
const TriggerGroup = ({ children, className, as: Component = "div" }) => (
  <Component className={className}>{children}</Component>
)

const Trigger = ({ id, children, className, as: Component = "div" }) => {
  const { activeId, registerTrigger } = useScrollContext()
  const triggerRef = useRef(null)

  useEffect(() => {
    registerTrigger(id, triggerRef)
  }, [id, registerTrigger])

  const isActive = activeId === id
  return (
    <Component ref={triggerRef} id={id} className={className}>
      {children(isActive)}
    </Component>
  )
}

const ReactorGroup = ({ children, className, as: Component = "div" }) => (
  <Component className={className}>{children}</Component>
)

// The Reactor needs to know which Trigger it corresponds to.
// We pass the `id` prop for this.
const Reactor = ({ id, children, className }) => {
  const { activeId } = useScrollContext()
  const isActive = activeId === id

  // The child is a function that we call with the `isActive` state
  return <div className={className}>{children(isActive)}</div>
}

// Attach sub-components to the main component
ScrollObserver.TriggerGroup = TriggerGroup
ScrollObserver.Trigger = Trigger
ScrollObserver.ReactorGroup = ReactorGroup
ScrollObserver.Reactor = Reactor