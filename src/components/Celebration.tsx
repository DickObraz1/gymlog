import { useEffect, useState } from 'react';

interface Props {
  show: boolean;
  onDone: () => void;
}

export default function Celebration({ show, onDone }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        onDone();
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [show, onDone]);

  if (!visible) return null;

  return (
    <div className="celebration">
      <div className="celebration-inner">🏆 Nový osobní rekord!</div>
    </div>
  );
}
