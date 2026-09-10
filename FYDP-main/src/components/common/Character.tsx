import { View, StyleSheet } from 'react-native';
import { Svg, Circle, Path, Ellipse } from 'react-native-svg';
import { CharacterConfig } from '../../types/auth';

interface CharacterProps {
  character: CharacterConfig;
  size?: number;
  expression?: 'happy' | 'excited' | 'sad' | 'thinking' | 'proud';
  color?: string;
}

const characterColors: Record<string, string> = {
  lumi_default: '#FBBF24',
  lumi_blue: '#0EA5E9',
  lumi_green: '#16A34A',
  lumi_pink: '#EC4899',
  lumi_orange: '#F97316',
  lumi_purple: '#8B5CF6',
  lumi_teal: '#14B8A6',
};

export function Character({ character, size = 120, expression = 'happy', color }: CharacterProps) {
  const bodyColor = color || characterColors[character.characterId] || '#FBBF24';
  const s = size;

  const renderEyes = () => {
    if (expression === 'excited' || expression === 'proud') {
      return (
        <>
          <Path
            d={`M ${s * 0.35} ${s * 0.42} Q ${s * 0.4} ${s * 0.35} ${s * 0.45} ${s * 0.42}`}
            stroke="#1A1A2E"
            strokeWidth={s * 0.025}
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d={`M ${s * 0.55} ${s * 0.42} Q ${s * 0.6} ${s * 0.35} ${s * 0.65} ${s * 0.42}`}
            stroke="#1A1A2E"
            strokeWidth={s * 0.025}
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    }
    if (expression === 'sad') {
      return (
        <>
          <Path
            d={`M ${s * 0.35} ${s * 0.42} Q ${s * 0.4} ${s * 0.45} ${s * 0.45} ${s * 0.42}`}
            stroke="#1A1A2E"
            strokeWidth={s * 0.025}
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d={`M ${s * 0.55} ${s * 0.42} Q ${s * 0.6} ${s * 0.45} ${s * 0.65} ${s * 0.42}`}
            stroke="#1A1A2E"
            strokeWidth={s * 0.025}
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    }
    if (expression === 'thinking') {
      return (
        <>
          <Circle cx={s * 0.4} cy={s * 0.42} r={s * 0.04} fill="#1A1A2E" />
          <Path
            d={`M ${s * 0.55} ${s * 0.42} Q ${s * 0.6} ${s * 0.45} ${s * 0.65} ${s * 0.42}`}
            stroke="#1A1A2E"
            strokeWidth={s * 0.025}
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    }
    return (
      <>
        <Circle cx={s * 0.4} cy={s * 0.42} r={s * 0.045} fill="#1A1A2E" />
        <Circle cx={s * 0.6} cy={s * 0.42} r={s * 0.045} fill="#1A1A2E" />
        <Circle cx={s * 0.41} cy={s * 0.41} r={s * 0.015} fill="#FFFFFF" />
        <Circle cx={s * 0.61} cy={s * 0.41} r={s * 0.015} fill="#FFFFFF" />
      </>
    );
  };

  const renderMouth = () => {
    if (expression === 'excited' || expression === 'proud') {
      return (
        <Path
          d={`M ${s * 0.38} ${s * 0.55} Q ${s * 0.5} ${s * 0.68} ${s * 0.62} ${s * 0.55}`}
          stroke="#1A1A2E"
          strokeWidth={s * 0.03}
          fill="#1A1A2E"
          strokeLinecap="round"
        />
      );
    }
    if (expression === 'sad') {
      return (
        <Path
          d={`M ${s * 0.4} ${s * 0.58} Q ${s * 0.5} ${s * 0.52} ${s * 0.6} ${s * 0.58}`}
          stroke="#1A1A2E"
          strokeWidth={s * 0.03}
          fill="none"
          strokeLinecap="round"
        />
      );
    }
    return (
      <Path
        d={`M ${s * 0.42} ${s * 0.55} Q ${s * 0.5} ${s * 0.6} ${s * 0.58} ${s * 0.55}`}
        stroke="#1A1A2E"
        strokeWidth={s * 0.025}
        fill="none"
        strokeLinecap="round"
      />
    );
  };

  const renderCheeks = () => (
    <>
      <Circle cx={s * 0.28} cy={s * 0.5} r={s * 0.04} fill="#FF6B9D" opacity={0.4} />
      <Circle cx={s * 0.72} cy={s * 0.5} r={s * 0.04} fill="#FF6B9D" opacity={0.4} />
    </>
  );

  const hasHat = character.accessory && character.accessory !== 'none';
  const hasGlasses = character.accessory === 'acc_glasses';

  return (
    <View style={[styles.container, { width: s, height: s }]}>
      <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        {/* Antenna */}
        <Path
          d={`M ${s * 0.5} ${s * 0.08} L ${s * 0.5} ${s * 0.18}`}
          stroke={bodyColor}
          strokeWidth={s * 0.03}
          strokeLinecap="round"
        />
        <Circle cx={s * 0.5} cy={s * 0.06} r={s * 0.04} fill={bodyColor} />

        {/* Body (rounded) */}
        <Path
          d={`M ${s * 0.25} ${s * 0.3}
              Q ${s * 0.25} ${s * 0.18} ${s * 0.5} ${s * 0.18}
              Q ${s * 0.75} ${s * 0.18} ${s * 0.75} ${s * 0.3}
              L ${s * 0.75} ${s * 0.72}
              Q ${s * 0.75} ${s * 0.92} ${s * 0.5} ${s * 0.92}
              Q ${s * 0.25} ${s * 0.92} ${s * 0.25} ${s * 0.72}
              Z`}
          fill={bodyColor}
        />

        {/* Highlight */}
        <Ellipse cx={s * 0.37} cy={s * 0.3} rx={s * 0.06} ry={s * 0.1} fill="#FFFFFF" opacity={0.2} />

        {/* Cheeks */}
        {renderCheeks()}

        {/* Eyes */}
        {renderEyes()}

        {/* Mouth */}
        {renderMouth()}

        {/* Glasses */}
        {hasGlasses && (
          <>
            <Circle cx={s * 0.4} cy={s * 0.42} r={s * 0.08} stroke="#1A1A2E" strokeWidth={s * 0.015} fill="none" />
            <Circle cx={s * 0.6} cy={s * 0.42} r={s * 0.08} stroke="#1A1A2E" strokeWidth={s * 0.015} fill="none" />
            <Path d={`M ${s * 0.48} ${s * 0.42} L ${s * 0.52} ${s * 0.42}`} stroke="#1A1A2E" strokeWidth={s * 0.015} />
          </>
        )}

        {/* Hat */}
        {hasHat && (
          <Path
            d={`M ${s * 0.28} ${s * 0.25}
                Q ${s * 0.5} ${s * 0.05} ${s * 0.72} ${s * 0.25}
                L ${s * 0.72} ${s * 0.28}
                L ${s * 0.28} ${s * 0.28}
                Z`}
            fill={character.accessory === 'hat_crown' ? '#FBBF24' : '#EF4444'}
          />
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
