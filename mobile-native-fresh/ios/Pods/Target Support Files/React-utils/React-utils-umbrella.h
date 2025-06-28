#ifdef __OBJC__
#import <UIKit/UIKit.h>
#else
#ifndef FOUNDATION_EXPORT
#if defined(__cplusplus)
#define FOUNDATION_EXPORT extern "C"
#else
#define FOUNDATION_EXPORT extern
#endif
#endif
#endif

#import "react/utils/react/utils/ContextContainer.h"
#import "react/utils/react/utils/FloatComparison.h"
#import "react/utils/react/utils/fnv1a.h"
#import "react/utils/react/utils/hash_combine.h"
#import "react/utils/react/utils/iequals.h"
#import "react/utils/react/utils/jsi-utils.h"
#import "react/utils/react/utils/ManagedObjectWrapper.h"
#import "react/utils/react/utils/OnScopeExit.h"
#import "react/utils/react/utils/PackTraits.h"
#import "react/utils/react/utils/RunLoopObserver.h"
#import "react/utils/react/utils/SharedFunction.h"
#import "react/utils/react/utils/SimpleThreadSafeCache.h"
#import "react/utils/react/utils/Telemetry.h"
#import "react/utils/react/utils/TemplateStringLiteral.h"
#import "react/utils/react/utils/toLower.h"
#import "react/utils/react/utils/to_underlying.h"

FOUNDATION_EXPORT double React_utilsVersionNumber;
FOUNDATION_EXPORT const unsigned char React_utilsVersionString[];

