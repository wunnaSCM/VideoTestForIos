//
//  FileEncryption.m
//  VideoTest
//
//  Created by Wunna on 3/30/23.
//

 #import <Foundation/Foundation.h>
 #import <React/RCTBridgeModule.h>


 @interface RCT_EXTERN_MODULE(FileEncryption, NSObject)

 RCT_EXTERN_METHOD(
     decrypt: (NSString *)sourceFile
     desFile:(NSString *)desFile
     key:(NSString *)key
     resolver: (RCTPromiseResolveBlock)resolve
     rejecter:(RCTPromiseRejectBlock)reject
 )

 @end
