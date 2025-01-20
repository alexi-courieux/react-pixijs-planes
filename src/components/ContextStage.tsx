import {_ReactPixi, Stage as PixiStage} from '@pixi/react';
import {Context, FC, ReactNode} from 'react';

interface ContextBridgeProps {
  children: ReactNode;
  Context: Context<any>;
  render: (children: ReactNode) => ReactNode;
}

const ContextBridge: FC<ContextBridgeProps> = ({ children, Context, render }) => {
  return (
    <Context.Consumer>
      {(value) =>
        render(<Context.Provider value={value}>{children}</Context.Provider>)
      }
    </Context.Consumer>
  );
};

interface ContextStageProps {
  children: ReactNode;
  context: Context<any>;
  stageProps: _ReactPixi.IStage;
}

const ContextStage: FC<ContextStageProps> = ({ children, context, stageProps }) => {
  return (
    <ContextBridge
      Context={context}
      render={(children) => <PixiStage {...stageProps}>{children}</PixiStage>}
    >
      {children}
    </ContextBridge>
  );
}

export default ContextStage;