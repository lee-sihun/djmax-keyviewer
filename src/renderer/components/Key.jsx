import React from 'react';
import { useDraggable } from '@hooks/useDraggable';
import { getKeyInfoByGlobalKey } from '@utils/KeyMaps';

export default function DraggableKey({ index, position, keyName, onPositionChange, onClick }) {
  const { displayName } = getKeyInfoByGlobalKey(keyName);
  const { dx, dy, width, activeImage, inactiveImage } = position;
  const draggable = useDraggable({
    gridSize: 10,
    initialX: dx,
    initialY: dy,
    onPositionChange: (newDx, newDy) => onPositionChange(index, newDx, newDy)
  });

  const handleClick = (e) => {
    if (!draggable.wasMoved) {  // 위치가 변경되지 않았을 때만 onClick 실행
      onClick(e);
    }
  };

  return (
    <div
      ref={draggable.ref}
      className="absolute rounded-[6px] h-[60px] cursor-pointer"
      style={{
        width: `${width}px`,
        transform: `translate(${draggable.dx}px, ${draggable.dy}px)`,
        backgroundImage: inactiveImage ? `url(${inactiveImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: inactiveImage ? 'transparent' : 'white'
      }}
      onClick={handleClick}
    >
      {!inactiveImage && (
        <div className="flex items-center justify-center h-full font-semibold">{displayName}</div>
      )}
    </div>
  );
};

export function Key({ keyName, active, position }) {
  const { dx, dy, width, activeImage, inactiveImage } = position;
  
  return (
    <div 
      className={`absolute rounded-[6px] h-[60px] ${active ? 'bg-[#575757] text-white' : 'bg-white text-black'}`}
      style={{
        width: `${width}px`,
        transform: `translate(${dx}px, ${dy}px)`,
        backgroundImage: active && activeImage ? 
          `url(${activeImage})` : 
          (!active && inactiveImage ? `url(${inactiveImage})` : 'none'),
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {(!active && !inactiveImage) || (active && !activeImage) ? (
        <div className="flex items-center justify-center h-full font-semibold">{keyName}</div>
      ) : null}
    </div>
  )
}