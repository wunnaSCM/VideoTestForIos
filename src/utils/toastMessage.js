import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import Toast, { BaseToast } from 'react-native-toast-message';

export const toastMessage = {

    success: (props) => (
        <BaseToast
            {...props}
            style={{ borderLeftColor: 'brown' }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 15,
                fontWeight: '400'
            }}
        />
    )
}
