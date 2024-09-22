import React from 'react';
import { VscEmptyWindow } from "react-icons/vsc";
import Header from './Header';
export default function Main() {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[85vh]">
        <VscEmptyWindow className="text-6xl text-gray-400" />
        <span className="text-xl font-semibold text-gray-700 mt-4">
          Hali hech qanday jadval mavjud emas
        </span>
        <span className="text-sm text-gray-500 mt-2">
          Jadval yaratish uchun tugmani bosing
        </span>
      </div>
    </>
  );
}
