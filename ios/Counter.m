//
//  Counter.m
//  VideoTest
//
//  Created by Wunna on 3/30/23.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(Counter, NSObject)

RCT_EXTERN_METHOD(
//    increment: (NSString *)email
//    password:(NSString *)password
//    resolve: (RCTPromiseResolveBlock)resolve
//    rejecter:(RCTPromiseRejectBlock)reject

      increment: (NSURL *)sourceFile
      desFile:(NSURL *)desFile
      key:(NSString *)key
      resolve: (RCTPromiseResolveBlock)resolve
      rejecter:(RCTPromiseRejectBlock)reject
    )

@end
