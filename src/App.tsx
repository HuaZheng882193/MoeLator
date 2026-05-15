/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpCircle,
  ArrowDownCircle,
  DoorOpen,
  Eye,
  Mic,
  CheckCircle2,
  Info,
  ChevronRight,
  Monitor,
  BellRing,
  Scale,
  Car,
  RefreshCcw,
  Navigation,
  Power,
  ArrowLeftCircle,
  ArrowRightCircle,
  Radio,
  Volume2,
  AlertTriangle
} from 'lucide-react';

// --- Types ---
interface LogicState {
  outsideCall: boolean;
  insideOpen: boolean;
  irSensor: boolean;
  voiceControl: boolean;
}

// --- Components ---

const ElevatorLogo = () => (
  <div className="relative w-16 h-16 flex items-center justify-center">
    <div className="absolute inset-0 bg-pink-200 rounded-2xl rotate-6 animate-pulse" />
    <div className="relative bg-white p-2 rounded-xl shadow-sm border-2 border-pink-300">
      <Monitor className="text-pink-500 w-8 h-8" />
    </div>
  </div>
);

const TeacherRobot = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="fixed bottom-6 right-6 z-50 flex items-end gap-3 max-w-sm"
  >
    <div className="bg-white p-4 rounded-2xl shadow-xl border-2 border-purple-200 relative">
      <p className="text-purple-800 text-sm font-medium leading-relaxed">
        {message}
      </p>
      {/* Speech bubble tail */}
      <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b-2 border-r-2 border-purple-200 rotate-45" />
    </div>
    <div className="bg-purple-500 p-3 rounded-full shadow-lg border-4 border-white">
      <Monitor className="text-white w-8 h-8" />
    </div>
  </motion.div>
);

function OrLogicFeature({ setLastAction }: { setLastAction: (msg: string) => void }) {
  const [logic, setLogic] = useState<LogicState>({
    outsideCall: false,
    insideOpen: false,
    irSensor: false,
    voiceControl: false,
  });

  const [countdown, setCountdown] = useState<number | null>(null);

  // The core "OR" logic
  const isDoorOpen = logic.outsideCall || logic.insideOpen || logic.irSensor || logic.voiceControl;

  const toggleLogic = (key: keyof LogicState) => {
    setLogic(prev => {
      const newVal = !prev[key];
      const actionNames: Record<string, string> = {
        outsideCall: "外部门铃",
        insideOpen: "内部开门键",
        irSensor: "红外感应",
        voiceControl: "语音检测"
      };
      setLastAction(`你点击了 ${actionNames[key]}，现在它是 ${newVal ? '1 (真)' : '0 (假)'}。`);
      return { ...prev, [key]: newVal };
    });
  };

  useEffect(() => {
    if (isDoorOpen) {
      setCountdown(8);
      setLastAction("太棒了！只要有一个条件满足，‘或’运算的结果就是‘1’，门就会开启！");
    } else {
      setCountdown(null);
      setLastAction("注意看，当所有条件都是‘0’时，‘或’运算的结果才是‘0’，门是关闭的。");
    }
  }, [logic.outsideCall, logic.insideOpen, logic.irSensor, logic.voiceControl, isDoorOpen, setLastAction]);

  useEffect(() => {
    let timer: any;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (countdown === 0) {
      setLogic({
        outsideCall: false,
        insideOpen: false,
        irSensor: false,
        voiceControl: false,
      });
      setCountdown(null);
      setLastAction("8秒到啦，由于没有新的指令，电梯门自动关闭了。这就是自动化控制！");
    }
    return () => clearTimeout(timer);
  }, [countdown, setLastAction]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Area: Elevator Visual */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="relative w-full max-w-sm aspect-[4/5] bg-purple-700 rounded-t-[4rem] rounded-b-2xl border-x-8 border-t-8 border-purple-800 shadow-2xl flex flex-col overflow-hidden">
          {/* Floor Display */}
          <div className="h-20 bg-black flex items-center justify-center border-b-4 border-purple-900 relative">
            <div className="bg-red-900/30 px-6 py-2 rounded flex flex-col items-center">
              <span className="text-red-500 font-mono text-3xl font-bold leading-none">6</span>
              <div className="flex gap-2 mt-1">
                <ArrowUpCircle className={`w-4 h-4 ${isDoorOpen ? 'text-red-500' : 'text-red-900'}`} />
                <div className={`w-4 h-4 rounded-full ${isDoorOpen ? 'bg-red-500 animate-pulse' : 'bg-red-900'}`} />
              </div>
            </div>

            {/* Countdown Display */}
            <AnimatePresence>
              {countdown !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute right-4 top-4 bg-red-600 text-white font-mono text-xl font-black w-10 h-10 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)] border-2 border-red-400"
                >
                  {countdown}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Doors Area */}
          <div className="flex-1 bg-purple-950 relative flex">
            {/* Background inside elevator */}
            <div className="absolute inset-0 bg-yellow-50 flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl mb-2">🎉</p>
                <p className="text-yellow-600 font-bold">欢迎进入！</p>
              </div>
            </div>

            {/* Left Door */}
            <motion.div
              className="w-1/2 h-full bg-gradient-to-r from-purple-500 to-purple-400 border-r border-purple-600/30 z-10 flex items-center justify-end pr-4"
              animate={{ translateX: isDoorOpen ? '-90%' : '0%' }}
              transition={{ type: "spring", stiffness: 60, damping: 20 }}
            >
              <div className="w-1 h-32 bg-purple-200/20 rounded-full" />
            </motion.div>

            {/* Right Door */}
            <motion.div
              className="w-1/2 h-full bg-gradient-to-l from-purple-500 to-purple-400 border-l border-purple-600/30 z-10 flex items-center justify-start pl-4"
              animate={{ translateX: isDoorOpen ? '90%' : '0%' }}
              transition={{ type: "spring", stiffness: 60, damping: 20 }}
            >
              <div className="w-1 h-32 bg-purple-200/20 rounded-full" />
            </motion.div>

            {/* Door Frame Detail */}
            <div className="absolute inset-0 pointer-events-none border-t-8 border-purple-900" />
          </div>

          {/* Bottom detail */}
          <div className="h-8 bg-purple-800" />
        </div>

        <div className="mt-8 bg-white/80 backdrop-blur p-6 rounded-3xl shadow-lg border border-white max-w-sm w-full">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-green-500" />
            状态监测
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between">
              <span className="text-sm text-gray-600">电梯状态</span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${isDoorOpen ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                {isDoorOpen ? '工作中' : '待机'}
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between">
              <span className="text-sm text-gray-600">逻辑输出</span>
              <span className={`text-lg font-mono font-bold ${isDoorOpen ? 'text-pink-600' : 'text-gray-400'}`}>
                {isDoorOpen ? '1 (真)' : '0 (假)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Area: Control Panel & Truth Table */}
      <div className="lg:col-span-5 space-y-6">
        {/* Control Panel */}
        <section className="bg-white p-6 rounded-[2rem] shadow-xl border-4 border-white">
          <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
            <DoorOpen className="text-pink-500" />
            输入控制指令
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'outsideCall', name: '外部呼叫键', icon: ArrowUpCircle, color: 'blue' },
              { id: 'insideOpen', name: '内部开门键', icon: DoorOpen, color: 'pink' },
              { id: 'irSensor', name: '红外感应器', icon: Eye, color: 'purple' },
              { id: 'voiceControl', name: '语音检测', icon: Mic, color: 'orange' }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = (logic as any)[item.id];
              return (
                <motion.button
                  id={`btn-${item.id}`}
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleLogic(item.id as keyof LogicState)}
                  className={`flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300 border-b-4 ${isActive
                      ? `bg-${item.color}-500 border-${item.color}-700 text-white shadow-lg translate-y-[2px]`
                      : 'bg-gray-100 border-gray-300 text-gray-500 grayscale'
                    }`}
                  style={{
                    backgroundColor: isActive ? (`${item.color === 'blue' ? '#3b82f6' : item.color === 'pink' ? '#ec4899' : item.color === 'purple' ? '#a855f7' : '#f97316'}`) : undefined
                  }}
                >
                  <Icon className="w-10 h-10 mb-3" />
                  <span className="font-bold whitespace-nowrap">{item.name}</span>
                  <span className="text-xs opacity-80 mt-1">{isActive ? '输入: 1' : '输入: 0'}</span>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Truth Table */}
        <section className="bg-white p-6 rounded-[2rem] shadow-xl overflow-hidden border-4 border-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <ChevronRight className="text-purple-500" />
              真值表秘密
            </h2>
            <div className="bg-purple-100 px-3 py-1 rounded-full text-xs font-bold text-purple-600">
              只要有一个是1，结果就是1
            </div>
          </div>

          <div className="overflow-x-auto">
            <table id="truth-table" className="w-full text-center border-separate border-spacing-1">
              <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-wider">
                  <th className="p-2">条件A</th>
                  <th className="p-2">+</th>
                  <th className="p-2">条件B</th>
                  <th className="p-2">=</th>
                  <th className="p-2">结果</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {[
                  [0, 0, 0, false],
                  [0, 1, 1, logic.insideOpen || logic.irSensor || logic.voiceControl],
                  [1, 0, 1, logic.outsideCall],
                  [1, 1, 1, logic.outsideCall && (logic.insideOpen || logic.irSensor || logic.voiceControl)]
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors duration-200 ${row[3] ? 'bg-pink-50' : 'bg-transparent'
                      }`}
                  >
                    <td className="p-3 bg-gray-50 rounded-lg text-lg font-bold">{row[0]}</td>
                    <td className="p-3 text-gray-300 font-bold">+</td>
                    <td className="p-3 bg-gray-50 rounded-lg text-lg font-bold">{row[1]}</td>
                    <td className="p-3 text-gray-300 font-bold">=</td>
                    <td className={`p-3 rounded-lg text-xl font-black ${row[2] === 1 ? 'text-pink-500' : 'text-gray-400'}`}>
                      {row[2]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="flex gap-3">
              <div className="bg-blue-500 p-2 rounded-xl h-fit text-white">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-blue-900 text-sm">老师敲黑板：</h4>
                <p className="text-blue-700 text-xs leading-relaxed mt-1">
                  这就是逻辑“或”运算（OR）。就像电梯一样，不论是外面的人按键，还是里面的人按键，只要有人需要门开，门就会响应。这是计算机程序中非常基础且重要的逻辑哦！
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function NotLogicFeature({ setLastAction }: { setLastAction: (msg: string) => void }) {
  const [weight, setWeight] = useState(399);
  const threshold = 500;
  const isOverloaded = weight > threshold;
  const notOverloaded = !isOverloaded; // 核心“非”逻辑

  useEffect(() => {
    if (!notOverloaded) {
      setLastAction("超载啦！触发非逻辑：当‘重量未超标’为0（假）时，输出报警并停止运行！");
    } else {
      setLastAction("重量正常。‘重量未超标’为1（真），电梯正常运行。");
    }
  }, [weight, notOverloaded, setLastAction]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Area: Elevator Visual with Scale */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="relative w-full max-w-sm aspect-[4/5] bg-purple-700 rounded-t-[4rem] rounded-b-2xl border-x-8 border-t-8 border-purple-800 shadow-2xl flex flex-col overflow-hidden">
          {/* Top Panel - Alarm Indicator */}
          <div className="h-20 bg-black flex items-center justify-center border-b-4 border-purple-900 relative gap-4">
            <motion.div
              animate={{ opacity: isOverloaded ? [1, 0.5, 1] : 0.3 }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className={`w-12 h-12 rounded-full flex items-center justify-center ${isOverloaded ? 'bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.8)]' : 'bg-red-900'}`}
            >
              <BellRing className={`w-6 h-6 ${isOverloaded ? 'text-white' : 'text-red-950'}`} />
            </motion.div>
            <div className="bg-red-900/30 px-6 py-2 rounded flex flex-col items-center">
              <span className={`font-mono text-2xl font-bold leading-none ${isOverloaded ? 'text-red-500' : 'text-green-500'}`}>
                {isOverloaded ? '超载 (STOP)' : '正常 (RUN)'}
              </span>
            </div>
          </div>

          {/* Elevator Inside */}
          <div className="flex-1 bg-purple-950 relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-yellow-50 flex flex-col items-center justify-end pb-8">
              {/* Passenger / Weight */}
              <motion.div
                animate={{ y: isOverloaded ? 10 : 0, scale: isOverloaded ? 1.05 : 1 }}
                className={`p-6 rounded-3xl flex flex-col items-center border-4 shadow-xl z-20 ${isOverloaded ? 'bg-red-100 border-red-300' : 'bg-green-100 border-green-300'}`}
              >
                <span className="text-6xl mb-2">{isOverloaded ? '😰' : '😊'}</span>
                <div className="bg-white px-4 py-2 rounded-full font-bold text-gray-800 flex items-center gap-2 shadow-sm">
                  <Scale className="w-4 h-4 text-gray-500" />
                  {weight} g
                </div>
              </motion.div>
            </div>

            {/* Left Door */}
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-purple-500 to-purple-400 border-r border-purple-600/30 z-10 flex items-center justify-end pr-4"
              animate={{ translateX: isOverloaded ? '0%' : '-90%' }}
              transition={{ type: "spring", stiffness: 60, damping: 20 }}
            >
              <div className="w-1 h-32 bg-purple-200/20 rounded-full" />
            </motion.div>

            {/* Right Door */}
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-purple-500 to-purple-400 border-l border-purple-600/30 z-10 flex items-center justify-start pl-4"
              animate={{ translateX: isOverloaded ? '0%' : '90%' }}
              transition={{ type: "spring", stiffness: 60, damping: 20 }}
            >
              <div className="w-1 h-32 bg-purple-200/20 rounded-full" />
            </motion.div>

            {/* Door Frame Detail */}
            <div className="absolute inset-0 pointer-events-none border-t-8 border-purple-900 z-30" />
          </div>

          <div className="h-8 bg-purple-800 z-30 relative" />
        </div>

        {/* Status Monitoring */}
        <div className="mt-8 bg-white/80 backdrop-blur p-6 rounded-3xl shadow-lg border border-white max-w-sm w-full">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-green-500" />
            系统状态监测
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between">
              <span className="text-sm text-gray-600">重量未超标</span>
              <span className={`text-lg font-mono font-bold ${notOverloaded ? 'text-green-600' : 'text-red-600'}`}>
                {notOverloaded ? '1 (真)' : '0 (假)'}
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between">
              <span className="text-sm text-gray-600">报警/停运</span>
              <span className={`text-lg font-mono font-bold ${isOverloaded ? 'text-red-600' : 'text-gray-400'}`}>
                {isOverloaded ? '1 (真)' : '0 (假)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Area: Controls */}
      <div className="lg:col-span-5 space-y-6">
        {/* Input Control */}
        <section className="bg-white p-6 rounded-[2rem] shadow-xl border-4 border-white">
          <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
            <Scale className="text-purple-500" />
            输入当前重量
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">载重阈值: {threshold}g</label>
            <input
              type="range"
              min="0"
              max="1000"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
              <span>0g</span>
              <span>1000g</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setWeight(399)}
              className={`py-3 rounded-xl font-bold transition-all border-b-4 ${weight === 399 ? 'bg-green-500 border-green-700 text-white translate-y-[2px]' : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'}`}
            >
              设为 399g (未超载)
            </button>
            <button
              onClick={() => setWeight(557)}
              className={`py-3 rounded-xl font-bold transition-all border-b-4 ${weight === 557 ? 'bg-red-500 border-red-700 text-white translate-y-[2px]' : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'}`}
            >
              设为 557g (已超载)
            </button>
          </div>
        </section>

        {/* Logic Explanation */}
        <section className="bg-white p-6 rounded-[2rem] shadow-xl border-4 border-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <ChevronRight className="text-purple-500" />
              “非”逻辑揭秘
            </h2>
            <div className="bg-purple-100 px-3 py-1 rounded-full text-xs font-bold text-purple-600">
              NOT (反转)
            </div>
          </div>

          <div className="space-y-4">
            <div className={`p-4 rounded-xl border-2 flex items-center justify-between transition-colors ${notOverloaded ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
              <div>
                <div className="font-bold text-gray-800">条件：重量未超标</div>
                <div className="text-sm text-gray-500">当前: {weight}g</div>
              </div>
              <div className={`text-2xl font-black ${notOverloaded ? 'text-green-500' : 'text-gray-400'}`}>
                {notOverloaded ? '1' : '0'}
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowDownCircle className="text-purple-300 w-8 h-8" />
            </div>

            <div className={`p-4 rounded-xl border-2 flex items-center justify-between transition-colors ${!notOverloaded ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
              <div>
                <div className="font-bold text-gray-800">结果：触发报警并停运</div>
                <div className="text-sm text-gray-500">非（NOT）逻辑运算</div>
              </div>
              <div className={`text-2xl font-black ${!notOverloaded ? 'text-red-500' : 'text-gray-400'}`}>
                {!notOverloaded ? '1' : '0'}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-50 rounded-2xl border border-purple-100">
            <div className="flex gap-3">
              <div className="bg-purple-500 p-2 rounded-xl h-fit text-white">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-purple-900 text-sm">老师敲黑板：</h4>
                <p className="text-purple-700 text-xs leading-relaxed mt-1">
                  这就是逻辑“非”运算（NOT）。它会把输入的状态反转。在这里，如果“重量未超标”这个条件为假（0），经过“非”运算后，输出的报警指令就变成了真（1）。
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function AndLogicFeature({ setLastAction }: { setLastAction: (msg: string) => void }) {
  const [signalOn, setSignalOn] = useState(false);
  const [conditionA, setConditionA] = useState(false); // turn_angle > 30
  const [conditionB, setConditionB] = useState(false); // return_to_normal

  const shouldExtinguish = conditionA && conditionB;

  useEffect(() => {
    if (signalOn && shouldExtinguish) {
      setSignalOn(false);
      setLastAction("条件均满足（1 AND 1 = 1），触发与逻辑，转向灯自动熄灭指令已发出！");
      // Optionally reset steering conditions automatically after extinguishing
      const timer = setTimeout(() => {
        setConditionA(false);
        setConditionB(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else if (signalOn) {
      if (!conditionA && !conditionB) {
        setLastAction("转向灯已开启（条件皆为0）。请转动方向盘超过30度。");
      } else if (conditionA && !conditionB) {
        setLastAction("已记录转角>30度。现在如果方向盘回正，灯就会自动熄灭哦。");
      } else if (!conditionA && conditionB) {
        setLastAction("方向盘已回正，但之前转角未超过30度（如变道），系统不会自动熄灭转向灯。");
      }
    }
  }, [conditionA, conditionB, signalOn, shouldExtinguish, setLastAction]);

  const toggleSignal = () => {
    if (!signalOn) {
      setSignalOn(true);
      setConditionA(false);
      setConditionB(false);
      setLastAction("手动开启转向灯。准备开始变道或转弯！");
    } else {
      setSignalOn(false);
      setLastAction("手动关闭了转向灯。");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Area: Car Visual */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="relative w-full max-w-sm aspect-[4/5] bg-blue-700 rounded-t-[4rem] rounded-b-2xl border-x-8 border-t-8 border-blue-800 shadow-2xl flex flex-col overflow-hidden">
          {/* Top Panel - Dashboard */}
          <div className="h-24 bg-black flex items-center justify-center border-b-4 border-blue-900 relative gap-8 px-6">
            <motion.div
              animate={{ opacity: signalOn ? [1, 0.2, 1] : 0.2 }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="w-12 h-12 flex items-center justify-center bg-gray-900 rounded-xl"
            >
              <ArrowLeftCircle className={`w-10 h-10 ${signalOn ? 'text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'text-gray-700'}`} />
            </motion.div>

            <div className="flex-1 text-center">
              <div className="bg-blue-900/50 px-4 py-1 rounded-full text-blue-200 font-mono text-sm border border-blue-700 inline-block mb-1">
                智能仪表盘
              </div>
              <div className={`text-xs font-bold ${signalOn ? 'text-green-400' : 'text-gray-500'}`}>
                {signalOn ? '转向灯闪烁中' : '转向灯已关闭'}
              </div>
            </div>

            <motion.div
              className="w-12 h-12 flex items-center justify-center bg-gray-900 rounded-xl"
            >
              {/* Using static right arrow to keep the layout symmetric */}
              <ArrowRightCircle className="w-10 h-10 text-gray-700" />
            </motion.div>
          </div>

          {/* Car Inside (Steering Wheel) */}
          <div className="flex-1 bg-blue-950 relative flex items-center justify-center overflow-hidden p-8">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-gray-200 flex flex-col items-center justify-center">
              <motion.div
                animate={{ rotate: conditionA && !conditionB ? -45 : (conditionB ? 0 : 0) }}
                transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                className="w-56 h-56 rounded-full border-[20px] border-gray-800 flex items-center justify-center relative shadow-2xl bg-gray-300"
              >
                {/* Wheel spokes */}
                <div className="absolute w-full h-6 bg-gray-800" />
                <div className="absolute w-6 h-full bg-gray-800" />

                {/* Center horn/logo area */}
                <div className="w-20 h-20 bg-gray-900 rounded-full z-10 flex items-center justify-center shadow-inner border-4 border-gray-600">
                  <Car className="w-8 h-8 text-gray-400" />
                </div>
              </motion.div>
            </div>

            <div className="absolute inset-0 pointer-events-none border-t-8 border-blue-900 z-30" />
          </div>

          <div className="h-8 bg-blue-800 z-30 relative" />
        </div>

        {/* Status Monitoring */}
        <div className="mt-8 bg-white/80 backdrop-blur p-6 rounded-3xl shadow-lg border border-white max-w-sm w-full">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-green-500" />
            系统状态监测
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between">
              <span className="text-sm text-gray-600">转向灯状态</span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${signalOn ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                {signalOn ? '工作中' : '已熄灭'}
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between">
              <span className="text-sm text-gray-600">自动熄灭(与)</span>
              <span className={`text-lg font-mono font-bold ${shouldExtinguish ? 'text-orange-600' : 'text-gray-400'}`}>
                {shouldExtinguish ? '1 (真)' : '0 (假)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Area: Controls */}
      <div className="lg:col-span-5 space-y-6">
        {/* Input Control */}
        <section className="bg-white p-6 rounded-[2rem] shadow-xl border-4 border-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
              <Car className="text-blue-500" />
              控制指令输入
            </h2>
            <button
              onClick={toggleSignal}
              className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${signalOn ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200 shadow-md'}`}
            >
              <Power className="w-4 h-4" />
              {signalOn ? '手动关闭转向' : '手动开启转向'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setConditionA(!conditionA);
                setLastAction(`你将“转角>30度”设置为 ${!conditionA ? '1 (真)' : '0 (假)'}。`);
              }}
              className={`flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300 border-b-4 ${conditionA
                  ? `bg-orange-500 border-orange-700 text-white shadow-lg translate-y-[2px]`
                  : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}
            >
              <Navigation className="w-10 h-10 mb-3" />
              <span className="font-bold whitespace-nowrap">条件A: 转角{'>'}30度</span>
              <span className="text-xs opacity-80 mt-1">{conditionA ? '输入: 1' : '输入: 0'}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setConditionB(!conditionB);
                setLastAction(`你将“方向盘回正”设置为 ${!conditionB ? '1 (真)' : '0 (假)'}。`);
              }}
              className={`flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300 border-b-4 ${conditionB
                  ? `bg-blue-500 border-blue-700 text-white shadow-lg translate-y-[2px]`
                  : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}
            >
              <RefreshCcw className="w-10 h-10 mb-3" />
              <span className="font-bold whitespace-nowrap">条件B: 判定回正</span>
              <span className="text-xs opacity-80 mt-1">{conditionB ? '输入: 1' : '输入: 0'}</span>
            </motion.button>
          </div>
        </section>

        {/* Logic Explanation */}
        <section className="bg-white p-6 rounded-[2rem] shadow-xl overflow-hidden border-4 border-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <ChevronRight className="text-blue-500" />
              “与”逻辑揭秘
            </h2>
            <div className="bg-blue-100 px-3 py-1 rounded-full text-xs font-bold text-blue-600">
              两个条件都要满足 (AND)
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-separate border-spacing-1">
              <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-wider">
                  <th className="p-2">条件A<br /><span className="text-[10px] opacity-70">转角&gt;30</span></th>
                  <th className="p-2">×</th>
                  <th className="p-2">条件B<br /><span className="text-[10px] opacity-70">方向盘回正</span></th>
                  <th className="p-2">=</th>
                  <th className="p-2">结果<br /><span className="text-[10px] opacity-70">自动熄灭</span></th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {[
                  [0, 0, 0, !conditionA && !conditionB],
                  [0, 1, 0, !conditionA && conditionB],
                  [1, 0, 0, conditionA && !conditionB],
                  [1, 1, 1, conditionA && conditionB]
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors duration-200 ${row[3] ? 'bg-orange-50 border-2 border-orange-200' : 'bg-transparent'
                      }`}
                  >
                    <td className="p-3 bg-gray-50 rounded-lg text-lg font-bold">{row[0]}</td>
                    <td className="p-3 text-gray-300 font-bold">×</td>
                    <td className="p-3 bg-gray-50 rounded-lg text-lg font-bold">{row[1]}</td>
                    <td className="p-3 text-gray-300 font-bold">=</td>
                    <td className={`p-3 rounded-lg text-xl font-black ${row[2] === 1 ? 'text-orange-500' : 'text-gray-400'}`}>
                      {row[2]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="flex gap-3">
              <div className="bg-blue-500 p-2 rounded-xl h-fit text-white">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-blue-900 text-sm">老师敲黑板：</h4>
                <p className="text-blue-700 text-xs leading-relaxed mt-1">
                  这就是逻辑“与”运算（AND）。两个条件（输入A和输入B）必须<b>同时满足</b>，结果才为真（1）。在汽车里，只有“转动角度够大”并且“方向盘回正”同时发生，转向灯才会自动熄灭，避免了变道时不小心熄灭的情况！
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SeatbeltLogicFeature({ setLastAction }: { setLastAction: (msg: string) => void }) {
  const [isFastened, setIsFastened] = useState(false);
  const [isBeeping, setIsBeeping] = useState(false);

  const alarmOn = !isFastened;

  useEffect(() => {
    let interval: any;
    if (alarmOn) {
      setLastAction("警告！微动开关状态为 0 (未系)，非运算输出为 1，发出蜂鸣警报！");
      interval = setInterval(() => {
        setIsBeeping(prev => !prev);
      }, 500);
    } else {
      setLastAction("安全带已系！微动开关状态为 1 (已系)，非运算输出为 0，警报解除。");
      setIsBeeping(false);
    }
    return () => clearInterval(interval);
  }, [alarmOn, setLastAction]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="relative w-full max-w-sm aspect-[4/5] bg-teal-700 rounded-t-[4rem] rounded-b-2xl border-x-8 border-t-8 border-teal-800 shadow-2xl flex flex-col overflow-hidden">
          <div className="h-20 bg-black flex items-center justify-center border-b-4 border-teal-900 relative gap-4">
            <motion.div
              animate={{ opacity: alarmOn ? (isBeeping ? 1 : 0.2) : 0.2 }}
              className={`w-12 h-12 rounded-full flex items-center justify-center ${alarmOn ? 'bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.8)]' : 'bg-gray-800'}`}
            >
              <BellRing className={`w-6 h-6 ${alarmOn ? 'text-white' : 'text-gray-600'}`} />
            </motion.div>
            <div className="bg-teal-900/30 px-6 py-2 rounded flex flex-col items-center">
              <span className={`font-mono text-xl font-bold leading-none ${alarmOn ? 'text-red-500' : 'text-green-500'}`}>
                {alarmOn ? '请系好安全带' : '安全带已系'}
              </span>
            </div>
          </div>

          <div className="flex-1 bg-teal-950 relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center">
              <motion.div
                className={`p-8 rounded-full flex flex-col items-center border-8 shadow-xl z-20 relative ${isFastened ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'}`}
              >
                <span className="text-6xl">{isFastened ? '😌' : '😰'}</span>

                <AnimatePresence>
                  {isFastened && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute w-32 h-4 bg-gray-800 rotate-45 z-30 shadow-md"
                      style={{ transformOrigin: 'center' }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              <div className="absolute bottom-10 bg-white px-4 py-2 rounded-xl shadow-md border-2 border-gray-300 flex items-center gap-3">
                <div className="text-sm font-bold text-gray-600">微动开关</div>
                <div className={`px-3 py-1 rounded font-mono font-bold text-white ${isFastened ? 'bg-green-500' : 'bg-red-500'}`}>
                  {isFastened ? '1 (按下)' : '0 (松开)'}
                </div>
              </div>
            </div>

            <div className="absolute inset-0 pointer-events-none border-t-8 border-teal-900 z-30" />
          </div>

          <div className="h-8 bg-teal-800 z-30 relative" />
        </div>

        <div className="mt-8 bg-white/80 backdrop-blur p-6 rounded-3xl shadow-lg border border-white max-w-sm w-full">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-green-500" />
            系统状态监测
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between">
              <span className="text-sm text-gray-600">安全带(输入A)</span>
              <span className={`text-lg font-mono font-bold ${isFastened ? 'text-green-600' : 'text-red-600'}`}>
                {isFastened ? '1' : '0'}
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between">
              <span className="text-sm text-gray-600">报警(输出C)</span>
              <span className={`text-lg font-mono font-bold ${alarmOn ? 'text-red-600' : 'text-gray-400'}`}>
                {alarmOn ? '1' : '0'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-6">
        <section className="bg-white p-6 rounded-[2rem] shadow-xl border-4 border-white">
          <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
            <Car className="text-teal-500" />
            模拟插扣操作
          </h2>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => setIsFastened(false)}
              className={`py-4 rounded-2xl font-bold transition-all border-b-4 flex items-center justify-center gap-2 ${!isFastened ? 'bg-red-500 border-red-700 text-white translate-y-[2px]' : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'}`}
            >
              拔出安全带 (微动开关: 0)
            </button>
            <button
              onClick={() => setIsFastened(true)}
              className={`py-4 rounded-2xl font-bold transition-all border-b-4 flex items-center justify-center gap-2 ${isFastened ? 'bg-green-500 border-green-700 text-white translate-y-[2px]' : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'}`}
            >
              插入安全带 (微动开关: 1)
            </button>
          </div>
        </section>

        <section className="bg-white p-6 rounded-[2rem] shadow-xl border-4 border-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <ChevronRight className="text-teal-500" />
              真值表逻辑
            </h2>
            <div className="bg-teal-100 px-3 py-1 rounded-full text-xs font-bold text-teal-600">
              NOT (非运算)
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-separate border-spacing-1">
              <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-wider">
                  <th className="p-2">安全带状态</th>
                  <th className="p-2">微动开关</th>
                  <th className="p-2">提醒蜂鸣</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {[
                  { state: '未系好', input: 0, output: 1, action: '发出提示音', active: !isFastened },
                  { state: '已系好', input: 1, output: 0, action: '停止提醒', active: isFastened }
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors duration-200 ${row.active ? 'bg-teal-50 border-2 border-teal-200' : 'bg-transparent'
                      }`}
                  >
                    <td className="p-3 bg-gray-50 rounded-lg text-sm font-bold">{row.state}</td>
                    <td className={`p-3 rounded-lg text-lg font-bold ${row.input === 1 ? 'text-green-500' : 'text-red-500'}`}>{row.input}</td>
                    <td className={`p-3 rounded-lg text-sm font-black ${row.output === 1 ? 'text-red-500' : 'text-gray-400'}`}>
                      {row.output} ({row.action})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-teal-50 rounded-2xl border border-teal-100">
            <div className="flex gap-3">
              <div className="bg-teal-500 p-2 rounded-xl h-fit text-white">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-teal-900 text-sm">老师敲黑板：</h4>
                <p className="text-teal-700 text-xs leading-relaxed mt-1">
                  这就是生活中的“非”逻辑（NOT）。硬件微动开关将物理状态转换为0和1。当输入为0（未系）时，系统取反输出1，触发警报；当输入为1（已系）时，输出0，解除警报。程序中还加入了延时器（定时模块），将持续的刺耳噪音优化为间歇性的提醒音，这就是仿真优化的“人性化”！
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ParkingSensorLogicFeature({ setLastAction }: { setLastAction: (msg: string) => void }) {
  const [distance, setDistance] = useState(35);
  const [isBeeping, setIsBeeping] = useState(false);

  let intervalMs: number | null = null;
  let speedText = '无提示';
  let beepColor = 'text-gray-400';
  let bgColor = 'bg-gray-100';
  let borderColor = 'border-gray-200';

  if (distance < 6) {
    intervalMs = 100;
    speedText = '快速 (急促)';
    beepColor = 'text-red-500';
    bgColor = 'bg-red-50';
    borderColor = 'border-red-500';
  } else if (distance <= 19) {
    intervalMs = 200;
    speedText = '适中 (注意)';
    beepColor = 'text-yellow-500';
    bgColor = 'bg-yellow-50';
    borderColor = 'border-yellow-500';
  } else if (distance <= 30) {
    intervalMs = 500;
    speedText = '缓慢 (障碍)';
    beepColor = 'text-blue-500';
    bgColor = 'bg-blue-50';
    borderColor = 'border-blue-500';
  }

  useEffect(() => {
    let interval: any;
    if (intervalMs !== null) {
      setLastAction(`倒车雷达：距离 ${distance}cm，警报间隔变更为 ${intervalMs}ms。`);
      interval = setInterval(() => {
        setIsBeeping(prev => !prev);
      }, intervalMs);
    } else {
      setLastAction(`倒车雷达：距离 ${distance}cm，安全距离。`);
      setIsBeeping(false);
    }
    return () => clearInterval(interval);
  }, [distance, intervalMs, setLastAction]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="relative w-full max-w-sm aspect-[4/5] bg-slate-700 rounded-t-[4rem] rounded-b-2xl border-x-8 border-t-8 border-slate-800 shadow-2xl flex flex-col overflow-hidden">
          <div className="h-20 bg-black flex items-center justify-center border-b-4 border-slate-900 relative gap-4">
            <motion.div
              animate={{ opacity: intervalMs ? (isBeeping ? 1 : 0.2) : 0.2 }}
              className={`w-12 h-12 rounded-full flex items-center justify-center ${intervalMs ? 'bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.8)]' : 'bg-gray-800'}`}
            >
              <Volume2 className={`w-6 h-6 ${intervalMs ? 'text-white' : 'text-gray-600'}`} />
            </motion.div>
            <div className="bg-slate-900/30 px-6 py-2 rounded flex flex-col items-center">
              <span className={`font-mono text-xl font-bold leading-none ${intervalMs ? beepColor : 'text-green-500'}`}>
                {intervalMs ? '注意防撞！' : '安全距离'}
              </span>
            </div>
          </div>

          <div className="flex-1 bg-slate-800 relative flex flex-col items-center justify-center overflow-hidden">
            {/* Wall */}
            <div className="absolute top-0 w-full h-12 bg-stone-600 flex items-center justify-center border-b-8 border-stone-800 z-30">
              <span className="text-stone-400 font-bold text-sm tracking-[0.5em]">WALL</span>
            </div>

            {/* Dashed Line */}
            <div className="absolute top-12 bottom-0 w-full flex justify-center z-10">
              <div className="h-full border-l-2 border-dashed border-slate-500" />
            </div>

            {/* Car Tail */}
            <motion.div
              animate={{ y: -(50 - distance) * 3.8 }} 
              className="absolute bottom-0 w-48 h-32 bg-gray-200 rounded-t-3xl border-4 border-gray-400 flex flex-col items-center justify-end pb-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-20"
            >
              {/* Distance Display */}
              <div className="absolute -top-16 bg-slate-700 px-4 py-2 rounded-3xl text-white font-mono text-2xl font-bold border-2 border-slate-500 shadow-lg flex flex-col items-center leading-none z-30">
                <span>{distance}</span>
                <span className="text-sm mt-1">cm</span>
              </div>

              {/* Radar Waves */}
              <AnimatePresence>
                {intervalMs && isBeeping && (
                  <motion.div
                    initial={{ opacity: 0.8, scale: 0.5, y: -20 }}
                    animate={{ opacity: 0, scale: 2.5, y: - (distance * 3.8) - 40 }}
                    transition={{ duration: intervalMs / 1000 }}
                    className={`absolute -top-4 rounded-[100%] border-4 ${borderColor} w-40 h-16 pointer-events-none`}
                  />
                )}
              </AnimatePresence>

              <div className="w-full px-4 flex justify-between relative z-20">
                <div className={`w-8 h-6 rounded shadow-lg ${intervalMs ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-red-800'}`} />
                <div className={`w-8 h-6 rounded shadow-lg ${intervalMs ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-red-800'}`} />
              </div>
              <div className="w-24 h-6 bg-gray-800 mt-2 rounded flex items-center justify-center border border-gray-600">
                <span className="text-white text-[10px] font-mono">MOE-882</span>
              </div>
              {/* Sensors */}
              <div className="flex gap-4 mt-2">
                <div className="w-3 h-3 bg-black rounded-full border border-gray-600" />
                <div className="w-3 h-3 bg-black rounded-full border border-gray-600" />
                <div className="w-3 h-3 bg-black rounded-full border border-gray-600" />
              </div>
            </motion.div>
          </div>

          <div className="h-8 bg-slate-900 z-30 relative" />
        </div>

        <div className="mt-8 bg-white/80 backdrop-blur p-6 rounded-3xl shadow-lg border border-white max-w-sm w-full">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-green-500" />
            超声波雷达状态
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between">
              <span className="text-sm text-gray-600">测距输入</span>
              <span className={`text-lg font-mono font-bold text-slate-600`}>
                {distance} cm
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between">
              <span className="text-sm text-gray-600">蜂鸣输出</span>
              <span className={`text-sm font-mono font-bold ${beepColor}`}>
                {speedText}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-6">
        <section className="bg-white p-6 rounded-[2rem] shadow-xl border-4 border-white">
          <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
            <Radio className="text-orange-500" />
            控制模拟倒车距离
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">与障碍物的距离: {distance} cm</label>
            <input
              type="range"
              min="0"
              max="50"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
              <span>0 cm (碰撞!)</span>
              <span>50 cm</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setDistance(35)}
              className={`py-3 rounded-xl font-bold transition-all border-b-4 ${distance > 30 ? 'bg-green-500 border-green-700 text-white translate-y-[2px]' : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'}`}
            >
              35cm (安全)
            </button>
            <button
              onClick={() => setDistance(25)}
              className={`py-3 rounded-xl font-bold transition-all border-b-4 ${distance <= 30 && distance >= 20 ? 'bg-blue-500 border-blue-700 text-white translate-y-[2px]' : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'}`}
            >
              25cm (缓慢)
            </button>
            <button
              onClick={() => setDistance(12)}
              className={`py-3 rounded-xl font-bold transition-all border-b-4 ${distance <= 19 && distance >= 6 ? 'bg-yellow-500 border-yellow-700 text-white translate-y-[2px]' : 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100'}`}
            >
              12cm (适中)
            </button>
            <button
              onClick={() => setDistance(3)}
              className={`py-3 rounded-xl font-bold transition-all border-b-4 ${distance < 6 ? 'bg-red-500 border-red-700 text-white translate-y-[2px]' : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'}`}
            >
              3cm (快速)
            </button>
          </div>
        </section>

        <section className="bg-white p-6 rounded-[2rem] shadow-xl border-4 border-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <ChevronRight className="text-orange-500" />
              距离越近，警报越急促
            </h2>
            <div className="bg-orange-100 px-3 py-1 rounded-full text-xs font-bold text-orange-600">
              程序等待时间控制
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-separate border-spacing-1">
              <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-wider">
                  <th className="p-2">距离</th>
                  <th className="p-2">编程度</th>
                  <th className="p-2">声音间隔</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {[
                  { range: '30 ~ 20 cm', level: '缓慢', ms: '500 毫秒', active: distance <= 30 && distance >= 20, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
                  { range: '19 ~ 6 cm', level: '适中', ms: '200 毫秒', active: distance <= 19 && distance >= 6, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
                  { range: '< 5 cm', level: '快速', ms: '100 毫秒', active: distance < 6, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' }
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors duration-200 ${row.active ? `${row.bg} border-2 ${row.border}` : 'bg-transparent'}`}
                  >
                    <td className="p-3 bg-gray-50 rounded-lg text-sm font-bold">{row.range}</td>
                    <td className={`p-3 rounded-lg text-sm font-bold ${row.active ? row.color : 'text-gray-500'}`}>{row.level}</td>
                    <td className={`p-3 rounded-lg text-sm font-black ${row.active ? row.color : 'text-gray-400'}`}>
                      {row.ms}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-orange-50 rounded-2xl border border-orange-100">
            <div className="flex gap-3">
              <div className="bg-orange-500 p-2 rounded-xl h-fit text-white">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-orange-900 text-sm">老师敲黑板：</h4>
                <p className="text-orange-700 text-xs leading-relaxed mt-1">
                  超声波传感器就像智能驾驶的“耳朵”，处理核心是“大脑”。程序通过修改代码中的“等待时间”参数（如500ms减至100ms）来改变警报音的频率，生动体现了通过代码逻辑来增强安全性的控制过程！
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'or' | 'not' | 'and' | 'seatbelt' | 'parking'>('or');
  const [lastAction, setLastAction] = useState<string>("欢迎来到信息技术课！");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 font-sans p-4 md:p-8 overflow-x-hidden">
      {/* Floating Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/40 rounded-full blur-xl"
            style={{
              width: Math.random() * 200 + 100,
              height: Math.random() * 200 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="flex justify-center mb-6">
            <ElevatorLogo />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-4 tracking-tight">
            生活中的逻辑大揭秘
          </h1>
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur px-4 py-2 rounded-full border border-purple-100 shadow-sm">
            <Info className="w-4 h-4 text-purple-500" />
            <p className="text-purple-700 font-medium text-sm">六年级信息技术课程演示</p>
          </div>
        </header>

        {/* Navigation Bar */}
        <div className="flex justify-center mb-10">
          <div className="bg-white/80 backdrop-blur p-2 rounded-full flex flex-wrap justify-center gap-2 shadow-sm border border-white">
            <button
              onClick={() => { setActiveTab('or'); setLastAction("已切换到电梯门控制（或运算）。"); }}
              className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-bold transition-all text-sm md:text-base ${activeTab === 'or' ? 'bg-pink-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
                }`}
            >
              第22课 电梯门的开与关
            </button>
            <button
              onClick={() => { setActiveTab('not'); setLastAction("已切换到超载报警系统（非运算）。"); }}
              className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-bold transition-all text-sm md:text-base ${activeTab === 'not' ? 'bg-purple-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
                }`}
            >
              第23课 如果超载电梯停
            </button>
            <button
              onClick={() => { setActiveTab('and'); setLastAction("已切换到自动熄灭转向灯系统（与运算）。"); }}
              className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-bold transition-all text-sm md:text-base ${activeTab === 'and' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
                }`}
            >
              第24课 自动熄灭转向灯
            </button>
            <button
              onClick={() => { setActiveTab('seatbelt'); setLastAction("已切换到安全带未系提醒系统（非运算）。"); }}
              className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-bold transition-all text-sm md:text-base ${activeTab === 'seatbelt' ? 'bg-teal-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
                }`}
            >
              第25课 安全带未系提醒
            </button>
            <button
              onClick={() => { setActiveTab('parking'); setLastAction("已切换到倒车防撞雷达系统（智能驾驶的耳朵与大脑）。"); }}
              className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-bold transition-all text-sm md:text-base ${activeTab === 'parking' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
                }`}
            >
              第26课 倒车防撞请注意
            </button>
          </div>
        </div>

        <main>
          {activeTab === 'or' && <OrLogicFeature setLastAction={setLastAction} />}
          {activeTab === 'not' && <NotLogicFeature setLastAction={setLastAction} />}
          {activeTab === 'and' && <AndLogicFeature setLastAction={setLastAction} />}
          {activeTab === 'seatbelt' && <SeatbeltLogicFeature setLastAction={setLastAction} />}
          {activeTab === 'parking' && <ParkingSensorLogicFeature setLastAction={setLastAction} />}
        </main>
      </div>

      <TeacherRobot message={lastAction} />

      {/* Decorative floating bubbles */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`bubble-${i}`}
            className="absolute opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 40 + 20}px`
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {['🫧', '✨', '☁️', '💓'][i % 4]}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
