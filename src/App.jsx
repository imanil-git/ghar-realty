function App() {
  return (
    <main className="mx-auto flex min-h-svh max-w-5xl flex-col justify-center px-6 py-16 sm:px-12">
      <p className="mb-8 text-sm uppercase tracking-[0.2em] text-neutral-500">
        Ghar Realty / Project foundation
      </p>
      <h1 className="max-w-3xl text-5xl leading-tight tracking-tight sm:text-7xl">
        A place for your next chapter.
      </h1>
      <p className="mt-6 max-w-xl text-base leading-7 text-neutral-600">
        React and Tailwind are ready. This is the setup screen; the design system,
        shared layouts, and property pages will follow in the next phases.
      </p>
      <div className="mt-12 grid gap-4 border-t border-neutral-300 pt-6 text-sm sm:grid-cols-3">
        <p>01 / React + Vite</p>
        <p>02 / Tailwind CSS</p>
        <p>03 / Red Hat Display</p>
      </div>
    </main>
  )
}

export default App
