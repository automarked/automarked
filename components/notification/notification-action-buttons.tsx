interface ActionButtonsProps {
    onAccept: () => void;
    onDecline: () => void;
  }
  
  export function ActionButtons({ onAccept, onDecline }: ActionButtonsProps) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={onDecline}
          className="px-4 py-2 text-sm text-gray-500 bg-gray-200 rounded hover:bg-gray-300"
        >
          Decline
        </button>
        <button
          onClick={onAccept}
          className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Accept
        </button>
      </div>
    );
  }
  