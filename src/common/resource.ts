declare const window: {
  GetParentResourceName: () => string;
};

export const IsBrowser =
  typeof window === 'undefined'
    ? 0 // Game
    : typeof window.GetParentResourceName !== 'undefined'
      ? 1 // CEF
      : 2; // Browser

export const ResourceContext = IsBrowser ? 'web' : IsDuplicityVersion() ? 'server' : 'client';

export const ResourceName = IsBrowser
  ? IsBrowser === 1
    ? window.GetParentResourceName()
    : 'nui-frame-app'
  : GetCurrentResourceName();
