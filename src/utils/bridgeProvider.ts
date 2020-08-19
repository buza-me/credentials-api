class Bridge {
  private actionsCollection: Map<string, ActionFunction[]> = new Map();

  private getFunctionsArray(actionName: string): ActionFunction[] {
    return this.actionsCollection.get(actionName) || [];
  }

  addActionListener(actionName: string, fn: ActionFunction): () => void {
    const functionsArray: ActionFunction[] = this.getFunctionsArray(actionName);
    functionsArray.push(fn);
    this.actionsCollection.set(actionName, functionsArray);
    return () => this.removeActionListener(actionName, fn);
  }

  removeActionListener(actionName: string, fn: ActionFunction) {
    let functionsArray: ActionFunction[] = this.getFunctionsArray(actionName);
    functionsArray = functionsArray.filter(
      (storedFn: ActionFunction) => storedFn !== fn,
    );
    this.actionsCollection.set(actionName, functionsArray);
  }

  dispatchAction(actionName: string, payload: any) {
    const functionsArray: ActionFunction[] = this.getFunctionsArray(actionName);
    return Promise.all(functionsArray.map((fn: ActionFunction) => fn(payload)));
  }
}

export const bridge = new Bridge();
