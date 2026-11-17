export function catchError(action) {
  return async (req, res, next) => {
    try {
      await action(req, res, next);
    } catch (error) {
      next(error);
      const e = error as any;
      console.error(e.name, '|', e.parent?.message, '|', e.parent?.detail); 
    }
  };
}
