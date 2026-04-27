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
  XCircle,
  Info,
  ChevronRight,
  Monitor
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

export default function App() {
  const [logic, setLogic] = useState<LogicState>({
    outsideCall: false,
    insideOpen: false,
    irSensor: false,
    voiceControl: false,
  });

  const [countdown, setCountdown] = useState<number | null>(null);
  const [lastAction, setLastAction] = useState<string>("欢迎来到信息技术课！");

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
  }, [logic.outsideCall, logic.insideOpen, logic.irSensor, logic.voiceControl]);

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
  }, [countdown]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 font-sans p-4 md:p-8 overflow-x-hidden">
      {/* Floating Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
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
        <header className="mb-12 text-center">
          <div className="flex justify-center mb-6">
            <ElevatorLogo />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4 tracking-tight">
            萌萌电梯：神奇的“或”运算
          </h1>
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur px-4 py-2 rounded-full border border-purple-100 shadow-sm">
            <Info className="w-4 h-4 text-purple-500" />
            <p className="text-purple-700 font-medium text-sm">六年级信息技术课程演示</p>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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
        </main>
      </div>

      <TeacherRobot message={lastAction} />

      {/* Decorative floating bubbles from image */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
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
