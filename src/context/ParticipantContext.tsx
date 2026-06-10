import { createContext, useContext, useState, type ReactNode } from "react";
import { participants, type Participant } from "../config/participants";

type ParticipantContextValue = {
  selected: Participant | null;
  toggle: (id: string) => void;
  clear: () => void;
};

const Ctx = createContext<ParticipantContextValue>({
  selected: null,
  toggle: () => {},
  clear: () => {},
});

export function ParticipantProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = participants.find((p) => p.id === selectedId) ?? null;
  const toggle = (id: string) =>
    setSelectedId((cur) => (cur === id ? null : id));
  const clear = () => setSelectedId(null);
  return <Ctx.Provider value={{ selected, toggle, clear }}>{children}</Ctx.Provider>;
}

export function useParticipant() {
  return useContext(Ctx);
}
