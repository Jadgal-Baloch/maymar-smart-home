"use client";

import { useState, useEffect } from "react";
import { ref, get, update, onValue } from "firebase/database";
import { DataSnapshot } from "firebase/database";

import { database } from "./utiles/firebase";

type DeviceState = {
  relay1: boolean;
  relay2: boolean;
  relay3: boolean;
  relay4: boolean;
};

export default function Component() {
  const [devices, setDevices] = useState<DeviceState>({
    relay1: false,
    relay2: false,
    relay3: false,
    relay4: false,
  });

  useEffect(() => {
    const devicesRef = ref(database, "SmartHome");

    const fetchDeviceStates = async () => {
      try {
        const snapshot = await get(devicesRef);
        if (snapshot.exists()) {
          const deviceData = snapshot.val();
          setDevices({
            relay1: !!deviceData.relay1,
            relay2: !!deviceData.relay2,
            relay3: !!deviceData.relay3,
            relay4: !!deviceData.relay4,
          });
        }
      } catch (error) {
        console.error("Error fetching device states:", error);
      }
    };

    fetchDeviceStates();

    const unsubscribe = onValue(devicesRef, (snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        const deviceData = snapshot.val();
        setDevices({
          relay1: !!deviceData.relay1,
          relay2: !!deviceData.relay2,
          relay3: !!deviceData.relay3,
          relay4: !!deviceData.relay4,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleDevice = async (device: keyof DeviceState) => {
    const newState = !devices[device];

    setDevices((prev) => ({
      ...prev,
      [device]: newState,
    }));

    try {
      const devicesRef = ref(database, "SmartHome");
      const snapshot = await get(devicesRef);

      if (snapshot.exists() && snapshot.val()[device] !== undefined) {
        await update(ref(database, "SmartHome"), {
          [device]: newState,
        });
      } else {
        console.log(`${device} not found in Firebase, no update made.`);
        setDevices((prev) => ({
          ...prev,
          [device]: !newState,
        }));
      }
    } catch (error) {
      console.error("Error updating device state:", error);
      setDevices((prev) => ({
        ...prev,
        [device]: !newState,
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="bg-black bg-opacity-80 backdrop-blur-md sticky top-0 z-50 border-b border-white border-opacity-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-3xl animate-bounce">🏠</span>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent uppercase tracking-wider">
              Maymar-Smart-Home
            </h1>
          </div>
          <nav className="hidden md:flex space-x-4">
            {["Dashboard", "Devices", "Settings"].map((item) => (
              <button
                key={item}
                className="px-4 py-2 rounded-lg border border-white border-opacity-10 hover:bg-white hover:bg-opacity-10 transition-all duration-300 ease-in-out"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Bedroom1 Bulb",
              icon: "💡",
              relay: "relay1",
              room: "Bedroom 1",
            },
            {
              name: "Bedroom1 Fan",
              icon: "✇🌫",
              relay: "relay2",
              room: "Bedroom 1",
            },
            {
              name: "Bedroom2 Bulb",
              icon: "💡",
              relay: "relay3",
              room: "Bedroom 2",
            },
            {
              name: "Bedroom2 Fan",
              icon: "✇🌫",
              relay: "relay4",
              room: "Bedroom 2",
            },
          ].map((device) => (
            <div
              key={`${device.name}-${device.relay}`}
              className="bg-gray-800 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-700"
            >
              <span className="text-5xl mb-4 inline-block">{device.icon}</span>
              <h2 className="text-xl font-semibold mb-2">{device.name}</h2>
              <p className="text-sm text-gray-400 mb-4">{device.room}</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={devices[device.relay as keyof DeviceState]}
                  onChange={() =>
                    toggleDevice(device.relay as keyof DeviceState)
                  }
                />
                <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
