export const snackBarSpy = jasmine.createSpyObj("MatSnackBar", ['open']);

export const localStorageSpy = jasmine.createSpyObj("LocalStorageService", ['getUser']);

export const userSpy = jasmine.createSpyObj("UserService", ['addHousehold',
                                                            'changeDefault',
                                                            'leaveHousehold']);

export const dialogHelperSpy = jasmine.createSpyObj("DialogHelperService", ['launchDialog']);

export const routerSpy = jasmine.createSpyObj("Router", ['navigate']);
