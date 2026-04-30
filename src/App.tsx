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
  ArrowRightCircle
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
                  className={`flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300 border-b-4 ${
                    isActive 
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
                    className={`transition-colors duration-200 ${
                      row[3] ? 'bg-pink-50' : 'bg-transparent'
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
              className={`flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300 border-b-4 ${
                conditionA 
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
              className={`flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300 border-b-4 ${
                conditionB 
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
                  <th className="p-2">条件A<br/><span className="text-[10px] opacity-70">转角&gt;30</span></th>
                  <th className="p-2">×</th>
                  <th className="p-2">条件B<br/><span className="text-[10px] opacity-70">方向盘回正</span></th>
                  <th className="p-2">=</th>
                  <th className="p-2">结果<br/><span className="text-[10px] opacity-70">自动熄灭</span></th>
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
                    className={`transition-colors duration-200 ${
                      row[3] ? 'bg-orange-50 border-2 border-orange-200' : 'bg-transparent'
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

export default function App() {
  const [activeTab, setActiveTab] = useState<'or' | 'not' | 'and'>('or');
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
              className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-bold transition-all text-sm md:text-base ${
                activeTab === 'or' ? 'bg-pink-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              神奇的“或”运算
            </button>
            <button 
              onClick={() => { setActiveTab('not'); setLastAction("已切换到超载报警系统（非运算）。"); }}
              className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-bold transition-all text-sm md:text-base ${
                activeTab === 'not' ? 'bg-purple-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              小哨兵超载报警 (非)
            </button>
            <button 
              onClick={() => { setActiveTab('and'); setLastAction("已切换到自动熄灭转向灯系统（与运算）。"); }}
              className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-bold transition-all text-sm md:text-base ${
                activeTab === 'and' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              自动熄灭转向灯 (与)
            </button>
          </div>
        </div>

        <main>
          {activeTab === 'or' && <OrLogicFeature setLastAction={setLastAction} />}
          {activeTab === 'not' && <NotLogicFeature setLastAction={setLastAction} />}
          {activeTab === 'and' && <AndLogicFeature setLastAction={setLastAction} />}
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
