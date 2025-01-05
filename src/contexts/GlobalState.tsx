// GlobalState.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

// 定义全局状态的类型
interface GlobalState {
  globalValue: string;
  setGlobalValue: (value: string) => void;
}

// 创建上下文
const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

// 自定义 Hook 用于获取全局状态
export const useGlobalState = (): GlobalState => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};

// 创建 Provider 组件
export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [globalValue, setGlobalValue] = useState<string>("初始值");

  return (
    <GlobalStateContext.Provider value={{ globalValue, setGlobalValue }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
