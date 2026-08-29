function MinimalFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-10 xl:px-14">
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} QuickBuy. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export { MinimalFooter }
