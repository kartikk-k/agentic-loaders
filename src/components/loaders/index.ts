import UptickLoader from "./UptickLoader";
import CandleLoader from "./CandleLoader";
import CalcLoader from "./CalcLoader";
import NodeLoader from "./NodeLoader";
import DogLoader from "./DogLoader";
import CatLoader from "./CatLoader";
import CarLoader from "./CarLoader";
import TireLoader from "./TireLoader";
import PlayLoader from "./PlayLoader";
import RocketLoader from "./RocketLoader";
import LaunchLoader from "./LaunchLoader";
import DinoLoader from "./DinoLoader";
import FlightLoader from "./FlightLoader";
import CursorLoader from "./CursorLoader";
import RadarLoader from "./RadarLoader";
import LetterLoader from "./LetterLoader";
import LayersLoader from "./LayersLoader";
import CountdownLoader from "./CountdownLoader";
import TerminalLoader from "./TerminalLoader";
import WifiLoader from "./WifiLoader";
import BatteryLoader from "./BatteryLoader";
import DownloadLoader from "./DownloadLoader";
import UploadLoader from "./UploadLoader";
import SearchLoader from "./SearchLoader";
import CodeLoader from "./CodeLoader";
import SnowLoader from "./SnowLoader";
import LightningLoader from "./LightningLoader";
import WaveLoader from "./WaveLoader";
import MoonLoader from "./MoonLoader";
import HourglassLoader from "./HourglassLoader";
import DiceLoader from "./DiceLoader";
import HeartbeatLoader from "./HeartbeatLoader";
import MusicLoader from "./MusicLoader";
import PacmanLoader from "./PacmanLoader";
import ClockLoader from "./ClockLoader";
import KeyLoader from "./KeyLoader";
import FlagLoader from "./FlagLoader";
import OrbitLoader from "./OrbitLoader";

export const LOADERS = [
  { name: "uptick", component: UptickLoader },
  { name: "candle", component: CandleLoader },
  { name: "calc", component: CalcLoader },
  { name: "node", component: NodeLoader },
  { name: "dog", component: DogLoader },
  { name: "cat", component: CatLoader },
  { name: "car", component: CarLoader },
  { name: "tire", component: TireLoader },
  { name: "play", component: PlayLoader },
  { name: "rocket", component: RocketLoader },
  { name: "launch", component: LaunchLoader },
  { name: "dino", component: DinoLoader },
  { name: "flight", component: FlightLoader },
  { name: "cursor", component: CursorLoader },
  { name: "radar", component: RadarLoader },
  { name: "letter", component: LetterLoader },
  { name: "layers", component: LayersLoader },
  { name: "countdown", component: CountdownLoader },
  { name: "terminal", component: TerminalLoader },
  { name: "wifi", component: WifiLoader },
  { name: "battery", component: BatteryLoader },
  { name: "download", component: DownloadLoader },
  { name: "upload", component: UploadLoader },
  { name: "search", component: SearchLoader },
  { name: "code", component: CodeLoader },
  { name: "snow", component: SnowLoader },
  { name: "lightning", component: LightningLoader },
  { name: "wave", component: WaveLoader },
  { name: "moon", component: MoonLoader },
  { name: "hourglass", component: HourglassLoader },
  { name: "dice", component: DiceLoader },
  { name: "heartbeat", component: HeartbeatLoader },
  { name: "music", component: MusicLoader },
  { name: "pacman", component: PacmanLoader },
  { name: "clock", component: ClockLoader },
  { name: "key", component: KeyLoader },
  { name: "flag", component: FlagLoader },
  { name: "orbit", component: OrbitLoader },
] as const;
