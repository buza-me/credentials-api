class Bridge {
  private actionsCollection: Map<string, actionFunction[]> = new Map();

  private getFunctionsArray(actionName: string): actionFunction[] {
    return this.actionsCollection.get(actionName) || [];
  }

  addActionListener(actionName: string, fn: actionFunction): () => void {
    const functionsArray: actionFunction[] = this.getFunctionsArray(actionName);
    functionsArray.push(fn);
    this.actionsCollection.set(actionName, functionsArray);
    return () => this.removeActionListener(actionName, fn);
  }

  removeActionListener(actionName: string, fn: actionFunction) {
    let functionsArray: actionFunction[] = this.getFunctionsArray(actionName);
    functionsArray = functionsArray.filter(
      (storedFn: actionFunction) => storedFn !== fn,
    );
    this.actionsCollection.set(actionName, functionsArray);
  }

  dispatchAction(actionName: string, payload: any) {
    const functionsArray: actionFunction[] = this.getFunctionsArray(actionName);
    return Promise.all(functionsArray.map((fn: actionFunction) => fn(payload)));
  }
}

export const bridge = new Bridge();
