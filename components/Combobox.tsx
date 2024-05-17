"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { programOptions } from "@/utils/programOptions"

import { cn } from "@/utils/lib/cn"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function ComboboxDemo({value, setValue}: {value: string, setValue: React.Dispatch<React.SetStateAction<string>>}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between overflow-hidden"
        >
          <span className="truncate">
            {value
              ? programOptions.find((program) => program.value === value)?.label
              : "Select program..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
        <Command>
          <CommandInput placeholder="Search programs..." />
          <CommandEmpty>No program found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {programOptions.map((program) => (
                <CommandItem
                  key={program.value}
                  value={program.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {program.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
