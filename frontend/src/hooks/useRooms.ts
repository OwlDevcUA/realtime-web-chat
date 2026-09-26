import { getRooms } from "@/services/roomApi"
import { Room } from "@/types/Room"
import { useCallback, useEffect, useState } from "react"

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([])

  const loadRooms = useCallback(async () => {
    setRooms([]);

    try {
      const loadedRooms = await getRooms();
        setRooms(loadedRooms);
      } catch (error) {
        console.error("Failed to load rooms:", error);
      }
  }, [])

  useEffect(() => {
    loadRooms()
  }, [loadRooms]);
  
  const addRoom = (room: Room) => {
    setRooms((prev) => [...prev, room]);
  }

  const deleteRoom = (roomId: string) => {
    setRooms((prev) => prev.filter(room => room.id !== roomId))
  }

  const onUpdate = (room: Room) => {
    setRooms((prev) => prev.map(oldRoom =>
      oldRoom.id === room.id ? room : oldRoom
      ))
  }

  return {
    rooms,
    loadRooms,
    addRoom,
    deleteRoom,
    onUpdate,
  }
}