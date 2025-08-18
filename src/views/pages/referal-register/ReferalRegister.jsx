import React, { useRef, useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import config from 'src/context/config';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import PageContainer from 'src/components/container/PageContainer';
import Logo from 'src/layouts/full/shared/logo/Logo';
import logoSmartBonos from 'src/assets/images/logos/logo-smart-bonos.png';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { InputAdornment, Button, MenuItem, Stack, Alert, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { OutlinedInput } from '@mui/material';
import { IconUser, IconCar, IconIdBadge2, IconPhone, IconMail } from '@tabler/icons';
import CustomSelect from '../../../components/forms/theme-elements/CustomSelect';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { db } from '../../../../firebaseConfig';
import CircularProgress from '@mui/material/CircularProgress';
import { UAParser } from 'ua-parser-js';
import {
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  collection,
  runTransaction,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore';
import { IconAlertTriangle, IconCheck, IconX } from '@tabler/icons';

const schema = yup.object().shape({
  driverCode: yup
    .string()
    .required('El código de conductor es obligatorio')
    .max(30, 'Máximo 30 caracteres'),
  firstName: yup.string().required('Los nombres son obligatorios').max(30, 'Máximo 30 caracteres'),
  lastName: yup.string().required('Los apellidos son obligatorios').max(30, 'Máximo 30 caracteres'),
  dni: yup
    .string()
    .required('El DNI es obligatorio')
    .matches(/^\d+$/, 'Solo números permitidos')
    .min(8, 'El DNI debe tener al menos 8 dígitos') // Cambiado de 5 a 8
    .max(12, 'El DNI no puede exceder 12 dígitos'),
  phone: yup
    .string()
    .required('El teléfono es obligatorio')
    .matches(/^\d+$/, 'Solo números permitidos')
    .max(12, 'Máximo 12 caracteres'),
  email: yup
    .string()
    .email('Debe ser un email válido')
    .required('El correo electrónico es obligatorio'),
  userType: yup.string().required('Debe seleccionar un tipo de usuario'),
});

const CustomFormLabel = styled((props) => (
  <Typography
    variant="subtitle1"
    fontWeight={600}
    {...props}
    component="label"
    htmlFor={props.htmlFor}
  />
))(() => ({
  marginBottom: '5px',
  marginTop: '25px',
  display: 'block',
}));

const CustomOutlinedInput = styled((props) => <OutlinedInput {...props} />)(({ theme }) => ({
  '& .MuiOutlinedInput-input::-webkit-input-placeholder': {
    color: theme.palette.text.secondary,
    opacity: '0.8',
  },

  '& .MuiTypography-root': {
    color: theme.palette.text.secondary,
  },

  '& .MuiOutlinedInput-input.Mui-disabled::-webkit-input-placeholder': {
    color: theme.palette.text.secondary,
    opacity: '1',
  },
}));

const ReferalRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [open, setOpen] = React.useState(false);
  const [recaptchaScore, setRecaptchaScore] = useState(null);
  const [isRecaptchaLoading, setIsRecaptchaLoading] = useState(false);
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlDriverCode = params.get('code') || '';
  const [driverCodeValidation, setDriverCodeValidation] = useState(null);
  const [driverCode, setDriverCode] = useState(urlDriverCode);
  const [rolesOptions, setRolesOptions] = useState([]);
  const [dniValidation, setDniValidation] = useState(null);
  const [dniValidationMessage, setDniValidationMessage] = useState('');
  const [currentDni, setCurrentDni] = useState('');
  const [dniTimeout, setDniTimeout] = useState(null);
  const [emailValidation, setEmailValidation] = useState(null);
  const [emailValidationMessage, setEmailValidationMessage] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [emailTimeout, setEmailTimeout] = useState(null);
  const [userType, setUserType] = useState(''); // Cadena vacía hasta que se carguen los roles

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
    setAlertMessage(null);
  };
  useEffect(() => {
    (async () => {
      /* A. IP + país, ciudad, región */
      const ipRes = await fetch('https://ipapi.co/json/'); // ⬅︎ gratis ≤ 1 000 req/día
      const ipJson = await ipRes.json();

      /* B. Navegador y SO */
      const ua = new UAParser();
      const browser = ua.getBrowser(); // {name, version}
      const os = ua.getOS(); // {name, version}

      /* C. GPS (podría fallar si el user no autoriza) */
      const getPosition = () =>
        new Promise((res, rej) =>
          navigator.geolocation
            ? navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 })
            : rej(),
        );

      let coords = null;
      try {
        const pos = await getPosition();
        coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      } catch (_) {
        /* sin ubicación precisa */
      }

      setMetadata({
        ip: ipJson.ip,
        browser: `${browser.name} ${browser.version}`,
        os: `${os.name} ${os.version}`,
        userAgent: navigator.userAgent,
        geo: coords, // null si no hay
        locationTxt: `${ipJson.country_code} · ${ipJson.region} · ${ipJson.city}`,
      });
    })();
  }, []);
  useEffect(() => {
    const fetchRoles = async () => {
      const rolesSnap = await getDocs(collection(db, 'roles'));
      const roles = rolesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRolesOptions(roles);

      // Encontrar el rol "Pasajero" y establecer su ID como valor por defecto
      const pasajeroRole = roles.find((role) => role.name === 'Pasajero');
      if (pasajeroRole) {
        setUserType(pasajeroRole.id);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    if (urlDriverCode) {
      validateDriverCode(urlDriverCode).catch(console.error);
    }
  }, [urlDriverCode]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (driverCode) {
        validateDriverCode(driverCode).catch(console.error);
      }
    }, 200); // espera 200ms después de dejar de escribir

    return () => clearTimeout(timeout); // limpia si sigue escribiendo
  }, [driverCode]);

  // Limpiar timeout cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (dniTimeout) {
        clearTimeout(dniTimeout);
      }
      if (emailTimeout) {
        clearTimeout(emailTimeout);
      }
    };
  }, [dniTimeout, emailTimeout]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      driverCode: urlDriverCode,
      userType: userType, // Agregar valor por defecto
    },
  });

  // Sincronizar el tipo de usuario con el formulario (MOVIDO DESPUÉS DE useForm)
  useEffect(() => {
    setValue('userType', userType);
  }, [userType, setValue]);

  useEffect(() => {
    // Update the document title using the browser API
    const timer = setTimeout(() => {
      handleClick();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (alertMessage) {
      setOpen(true); // cada vez que cambia el mensaje, se activa el Snackbar
    }
  }, [alertMessage]);

  // Precargar reCAPTCHA cuando la página se carga
  useEffect(() => {
    const loadRecaptcha = async () => {
      if (!window.grecaptcha) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src =
            'https://www.google.com/recaptcha/api.js?render=6LfVdVwrAAAAAHX1wbJtRmc2ZGF_JrALgEpTvBWb';
          script.onload = resolve;
          document.head.appendChild(script);
        });

        // Esperar a que reCAPTCHA se inicialice
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsRecaptchaReady(true);
        console.log('✅ reCAPTCHA v3 cargado y listo');
      } else {
        setIsRecaptchaReady(true);
        console.log('✅ reCAPTCHA v3 ya estaba cargado');
      }
    };

    loadRecaptcha();
  }, []);

  const API_URL = 'https://validarcodigo-q7nx2wkxda-uc.a.run.app';

  // Estado para almacenar los datos del conductor obtenidos de la API
  const [conductorData, setConductorData] = useState(null);

  const validateDriverCode = async (code, silent = false) => {
    if (!code) return { isValid: false, data: null };

    try {
      const response = await fetch(`${API_URL}/${code}`);
      const result = await response.json();
      const isValid = result?.data?.ok === '1';

      // Extraer datos adicionales del conductor si existe
      const driverData = isValid
        ? {
            nombres: result.data.nombres || '',
            dni: result.data.dni || '',
            telefono: result.data.telefono || '',
            correo: result.data.correo || '',
          }
        : null;

      // Solo actualiza el estado si no es validación silenciosa
      if (!silent) {
        setDriverCodeValidation(isValid ? 'valid' : 'invalid');
        setConductorData(driverData);
      }

      return { isValid, data: driverData };
    } catch (error) {
      console.error('Error validando el código de conductor:', error);
      if (!silent) {
        setDriverCodeValidation('invalid');
        setConductorData(null);
      }
      return { isValid: false, data: null };
    }
  };

  // Función para validar si el DNI ya pertenece a un conductor de Taxi Sonrisas
  const validateDriverDNI = async (dni) => {
    if (!dni || dni.length < 8) {
      // Cambiado de 5 a 8 dígitos
      setDniValidation(null);
      setDniValidationMessage('');
      return { isDriver: false, data: null };
    }

    try {
      const response = await fetch(
        `https://us-central1-taxi-smiles-referral.cloudfunctions.net/validarDNIConductor/${dni}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const result = await response.json();

      if (result.success && result.data) {
        // El DNI pertenece a un conductor de Taxi Sonrisas

        setDniValidation('driver');
        setDniValidationMessage(
          `Ya estás registrado como conductor en Taxi Sonrisas. No es posible afiliarte nuevamente.`,
        );
        return { isDriver: true, data: result.data };
      } else {
        // El DNI no pertenece a un conductor de Taxi Sonrisas (success: false o data: null)

        setDniValidation('not_driver');
        setDniValidationMessage(''); // Sin mensaje cuando está disponible
        return { isDriver: false, data: null };
      }
    } catch (error) {
      console.error('Error validando DNI del conductor:', error);
      setDniValidation('error');
      setDniValidationMessage('Error al validar el DNI. Inténtalo de nuevo.');
      return { isDriver: false, data: null };
    }
  };

  // Función para validar si el correo electrónico ya existe en la colección referrals
  const validateEmailReferral = async (email) => {
    if (!email || !email.includes('@')) {
      setEmailValidation(null);
      setEmailValidationMessage('');
      return { exists: false };
    }

    try {
      const emailQuery = query(collection(db, 'referrals'), where('correo', '==', email));
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        // El correo ya existe en la colección referrals
        setEmailValidation('exists');
        setEmailValidationMessage('Ya existe un referido con el correo electrónico ingresado.');
        return { exists: true };
      } else {
        // El correo no existe, está disponible
        setEmailValidation('available');
        setEmailValidationMessage(''); // Sin mensaje cuando está disponible
        return { exists: false };
      }
    } catch (error) {
      console.error('Error validando correo electrónico:', error);
      setEmailValidation('error');
      setEmailValidationMessage('Error al validar el correo electrónico. Inténtalo de nuevo.');
      return { exists: false };
    }
  };

  // Función para ejecutar reCAPTCHA v3
  const executeRecaptcha = async (action = 'submit') => {
    setIsRecaptchaLoading(true);
    try {
      // Verificar que reCAPTCHA esté disponible
      if (!window.grecaptcha) {
        throw new Error('reCAPTCHA no está disponible');
      }

      // Ejecutar reCAPTCHA
      const token = await window.grecaptcha.execute('6LfVdVwrAAAAAHX1wbJtRmc2ZGF_JrALgEpTvBWb', {
        action,
      });

      // Verificar el token en el backend (opcional pero recomendado)
      const verificationResponse = await fetch('https://verifyrecaptcha-q7nx2wkxda-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, action }),
      });

      const verificationResult = await verificationResponse.json();

      if (
        verificationResult &&
        verificationResult.success &&
        verificationResult.score !== undefined
      ) {
        setRecaptchaScore(verificationResult.score);
        console.log('🔒 reCAPTCHA Score:', verificationResult.score.toFixed(2));
        return {
          success: verificationResult.score >= 0.5, // Umbral recomendado por Google
          score: verificationResult.score,
        };
      } else {
        setRecaptchaScore(0);
        console.log('❌ reCAPTCHA falló:', verificationResult?.error || 'Error desconocido');
        return {
          success: false,
          score: 0,
        };
      }
    } catch (error) {
      console.error('Error ejecutando reCAPTCHA:', error);
      setRecaptchaScore(0);
      return {
        success: false,
        score: 0,
      };
    } finally {
      setIsRecaptchaLoading(false);
    }
  };

  // Función para manejar cambios en el DNI
  const handleDniChange = (e) => {
    const dni = e.target.value;
    setCurrentDni(dni);

    // Limpiar timeout anterior si existe
    if (dniTimeout) {
      clearTimeout(dniTimeout);
    }

    if (dni && dni.length >= 8) {
      // Cambiado de 5 a 8 dígitos

      const timeout = setTimeout(() => {
        validateDriverDNI(dni).catch(console.error);
      }, 200); // Cambiado de 500ms a 200ms para igualar velocidad del código

      setDniTimeout(timeout);
    } else {
      setDniValidation(null);
      setDniValidationMessage('');
    }
  };

  // Función para manejar cambios en el correo electrónico
  const handleEmailChange = (e) => {
    const email = e.target.value;
    setCurrentEmail(email);

    // Limpiar timeout anterior si existe
    if (emailTimeout) {
      clearTimeout(emailTimeout);
    }

    if (email && email.includes('@')) {
      const timeout = setTimeout(() => {
        validateEmailReferral(email).catch(console.error);
      }, 200); // Mismo delay que el DNI para consistencia

      setEmailTimeout(timeout);
    } else {
      setEmailValidation(null);
      setEmailValidationMessage('');
    }
  };

  // Validar si el formulario puede ser enviado
  const canSubmit =
    isValid &&
    driverCodeValidation === 'valid' &&
    dniValidation !== 'driver' &&
    emailValidation !== 'exists' &&
    !isLoading;

  const onSubmit = async (data) => {
    setIsLoading(true);

    // Ejecutar reCAPTCHA antes de procesar el formulario
    const recaptchaResult = await executeRecaptcha('register_referral');

    if (!recaptchaResult.success) {
      setAlertMessage('Verificación de seguridad fallida. Por favor, inténtalo de nuevo.');
      setAlertSeverity('error');
      setOpen(true);
      setIsLoading(false);
      return;
    }

    // Usar el score directamente del resultado
    const currentRecaptchaScore = recaptchaResult.score;

    const latestCode = data.driverCode;
    const code = latestCode;

    // Validar una vez más el código antes de continuar y obtener datos del conductor
    const validationResult = await validateDriverCode(latestCode, true);

    if (!validationResult.isValid) {
      setDriverCodeValidation('invalid');
      setIsLoading(false);
      return; // No continúa si es inválido
    }

    const conductorInfo = validationResult.data;

    const roleId = data.userType; // "conductor" | "pasajero"
    const dni = data.dni;

    // 🔍 PRE-VALIDACIÓN 0: Verificar que el DNI no pertenezca ya a un conductor de Taxi Sonrisas
    const dniValidationResult = await validateDriverDNI(dni);
    if (dniValidationResult.isDriver) {
      setAlertMessage(
        'No se puede registrar este DNI porque ya pertenece a un conductor de Taxi Sonrisas.',
      );
      setAlertSeverity('error');
      setOpen(true);
      setIsLoading(false);
      return;
    }

    // 🔍 PRE-VALIDACIÓN 1: Verificar que el correo electrónico no exista ya en referrals
    const emailValidationResult = await validateEmailReferral(data.email);
    if (emailValidationResult.exists) {
      setAlertMessage(
        'No se puede registrar este correo electrónico porque ya existe un referido con ese correo.',
      );
      setAlertSeverity('error');
      setOpen(true);
      setIsLoading(false);
      return;
    }

    try {
      const selectedRole = rolesOptions.find((r) => r.id === roleId);
      const roleName = selectedRole?.name || 'Desconocido';

      // 🔍 PRE-VALIDACIÓN 1: Buscar usuario existente con el mismo DNI para asociar al referralCode
      let existingUserId = null;
      if (conductorInfo?.dni) {
        const userQuery = query(collection(db, 'users'), where('dni', '==', conductorInfo.dni));
        const userSnapshot = await getDocs(userQuery);
        if (!userSnapshot.empty) {
          existingUserId = userSnapshot.docs[0].id;
        }
      }

      // 🔍 PRE-VALIDACIÓN 2: Buscar usuario existente con el mismo DNI del referral para asociar
      let existingReferralUserId = null;

      const referralUserQuery = query(collection(db, 'users'), where('dni', '==', dni));
      const referralUserSnapshot = await getDocs(referralUserQuery);
      if (!referralUserSnapshot.empty) {
        existingReferralUserId = referralUserSnapshot.docs[0].id;
      }

      await runTransaction(db, async (tx) => {
        /** 1️⃣  Verificar / crear referralCodes */
        const codeRef = doc(db, 'referralCodes', code);
        //const generatedCodeId = codeRef.id; // Si quieres guardar este ID para luego

        const codeSnap = await tx.get(codeRef);

        if (!codeSnap.exists()) {
          // Crea doc si no existe con los datos del conductor obtenidos de la API
          const referralCodeData = {
            code: code,
            type: 'Conductor',
            nombre: conductorInfo?.nombres || '',
            dni: conductorInfo?.dni || '',
            telefono: conductorInfo?.telefono || '',
            correo: conductorInfo?.correo || '',
            activo: true,
            countConductores: 0,
            countPasajeros: 0,
            createdAt: serverTimestamp(),
          };

          // 🔗 NUEVO: Agregar userId si se encontró usuario existente
          if (existingUserId) {
            referralCodeData.userId = existingUserId;
          }

          tx.set(codeRef, referralCodeData);
        } else if (!codeSnap.data().activo) {
          throw new Error('El código está inactivo.');
        }

        /** 2️⃣  Validar que no se registre a sí mismo */
        if (conductorInfo?.dni && conductorInfo.dni === dni) {
          throw new Error(
            'No puedes registrarte a ti mismo como referido usando tu propio código.',
          );
        }

        /** 3️⃣  Chequear duplicidad DNI */
        const dupQ = query(collection(db, 'referrals'), where('dni', '==', dni));

        const dupSnap = await getDocs(dupQ);
        if (!dupSnap.empty) {
          throw new Error('Ya existe un referido con el DNI ingresado.');
        }

        /** 4️⃣  Chequear límites */
        const dataCode = codeSnap.exists()
          ? codeSnap.data()
          : { countConductores: 0, countPasajeros: 0 };
        const newCount =
          roleName.toLowerCase() === 'conductor'
            ? dataCode.countConductores + 1
            : dataCode.countPasajeros + 1;

        const limit = roleName.toLowerCase() === 'conductor' ? 50 : 300;
        if (newCount > limit) {
          throw new Error(`Límite alcanzado: no se permiten más de ${limit} ${roleId}s referidos.`);
        }

        /** 5️⃣  Registrar usuario referido */
        const userRef = doc(collection(db, 'referrals')); // auto-id

        // Crear el documento base del referral
        const referralData = {
          codeId: code, // CAMBIO: registerCode → codeId (uid del referralCode)
          active: false,
          role: roleId,
          dni,
          roleName: roleName,
          nombres: data.firstName,
          apellidos: data.lastName,
          telefono: data.phone,
          correo: data.email, // Campo correo del formulario
          auth: false, // Por defecto el referido no tiene cuenta de autenticación
          createdAt: serverTimestamp(),
          metadata: metadata
            ? {
                ...metadata,
                collectedAt: serverTimestamp(),
                recaptchaScore: currentRecaptchaScore, // Guardar el score para análisis
              }
            : {},
        };

        // 🔗 NUEVO: Agregar campo auth si se encontró usuario existente
        if (existingReferralUserId) {
          referralData.auth = existingReferralUserId; // uid del usuario en colección users
        }

        tx.set(userRef, referralData);

        /** 6️⃣  Actualizar contador */
        tx.update(codeRef, {
          [roleName.toLowerCase() === 'conductor' ? 'countConductores' : 'countPasajeros']:
            newCount,
        });
      });

      setAlertMessage('Referido registrado correctamente');
      setAlertSeverity('success');

      reset({
        driverCode: driverCode, // dejamos el código para no borrarlo
        firstName: '',
        lastName: '',
        dni: '',
        phone: '',
        email: '',
        userType: userType, // Usar el estado local en lugar de un valor hardcodeado
      });

      // Resetear reCAPTCHA
      setRecaptchaScore(null);
    } catch (err) {
      setAlertMessage(`${err.message}`);
      setAlertSeverity('error');
      setOpen(true);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer title="Registrar Referidos">
      <Box
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '0.3',
          },
        }}
      >
        <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
          <Grid
            size={{ xs: 12, sm: 12, lg: 5, xl: 4 }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card elevation={9} sx={{ p: 4, m: 3, zIndex: 1, width: '100%', maxWidth: '480px' }}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Box
                  component="img"
                  src={logoSmartBonos}
                  alt="Logo Smart Bonos"
                  sx={{
                    width: '230px',
                    objectFit: 'contain',
                    overflow: 'hidden',
                    height: 'auto',
                    display: 'block',
                    mb: 5,
                    mt: 3,
                  }}
                />
              </Box>
              <Typography variant="h4" fontWeight="700" mb={3}>
                Registro de Referido
              </Typography>

              <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={1}>
                    <Grid size={12}>
                      <CustomFormLabel htmlFor="driverCode" sx={{ mt: 0 }}>
                        Código de conductor
                      </CustomFormLabel>
                    </Grid>
                    <Grid size={12}>
                      <CustomOutlinedInput
                        startAdornment={
                          <InputAdornment position="start">
                            <IconCar size="20" />
                          </InputAdornment>
                        }
                        id="driverCode"
                        {...register('driverCode')}
                        value={driverCode}
                        onChange={(e) => {
                          setDriverCode(e.target.value);
                        }}
                        fullWidth
                      />
                      {errors.driverCode && (
                        <Typography variant="caption" color="error">
                          {errors.driverCode.message}
                        </Typography>
                      )}

                      {driverCodeValidation === 'valid' && (
                        <Typography variant="caption" color="success">
                          El código es válido
                        </Typography>
                      )}
                      {driverCodeValidation === 'invalid' && (
                        <Typography variant="caption" color="error">
                          El código es inválido
                        </Typography>
                      )}
                    </Grid>

                    <Grid size={12}>
                      <CustomFormLabel htmlFor="userType" sx={{ mt: 0 }}>
                        Tipo de usuario
                      </CustomFormLabel>
                      {rolesOptions.length === 0 && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mb: 1, display: 'block' }}
                        >
                          Cargando tipos de usuario...
                        </Typography>
                      )}
                      <CustomSelect
                        fullWidth
                        variant="outlined"
                        value={userType}
                        onChange={(e) => {
                          setUserType(e.target.value);
                          // Sincronizar con React Hook Form
                          setValue('userType', e.target.value);
                        }}
                        input={
                          <OutlinedInput
                            startAdornment={
                              <InputAdornment position="start">
                                <IconUser size="20" />
                              </InputAdornment>
                            }
                          />
                        }
                        defaultValue=""
                        disabled={rolesOptions.length === 0} // Deshabilitar hasta que se carguen los roles
                      >
                        {rolesOptions.length === 0 ? (
                          <MenuItem value="">Cargando roles...</MenuItem>
                        ) : (
                          rolesOptions.map((role) => (
                            <MenuItem key={role.id} value={role.id}>
                              {role.name}
                            </MenuItem>
                          ))
                        )}
                      </CustomSelect>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CustomFormLabel htmlFor="firstname" sx={{ mt: { xs: 0 } }}>
                        Nombres
                      </CustomFormLabel>
                      <Grid>
                        <CustomOutlinedInput id="firstName" {...register('firstName')} fullWidth />
                        {errors.firstName && (
                          <Typography variant="caption" color="error">
                            {errors.firstName.message}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CustomFormLabel htmlFor="lastName" sx={{ mt: { xs: 0 } }}>
                        Apellidos
                      </CustomFormLabel>
                      <Grid>
                        <CustomOutlinedInput id="lastName" {...register('lastName')} fullWidth />
                        {errors.lastName && (
                          <Typography variant="caption" color="error">
                            {errors.lastName.message}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>

                    <Grid size={12}>
                      <CustomFormLabel htmlFor="dni" sx={{ mt: 0 }}>
                        DNI
                      </CustomFormLabel>
                    </Grid>
                    <Grid size={12}>
                      <CustomOutlinedInput
                        startAdornment={
                          <InputAdornment position="start">
                            <IconIdBadge2 size="20" />
                          </InputAdornment>
                        }
                        id="dni"
                        {...register('dni')}
                        fullWidth
                        inputProps={{ maxLength: 12 }} // Limita la longitud a 12
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/[^0-9]/g, '');
                        }}
                        onChange={(e) => {
                          handleDniChange(e);
                          // También llamar al onChange de register para mantener sincronizado
                          const { onChange } = register('dni');
                          onChange(e);
                        }}
                      />
                      {errors.dni && (
                        <Typography variant="caption" color="error">
                          {errors.dni.message}
                        </Typography>
                      )}

                      {/* Validación del DNI del conductor */}
                      {dniValidation === 'driver' && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ display: 'block', mt: 1 }}
                        >
                          {dniValidationMessage}
                        </Typography>
                      )}
                    </Grid>

                    <Grid size={12}>
                      <CustomFormLabel htmlFor="phone" sx={{ mt: 0 }}>
                        Teléfono
                      </CustomFormLabel>
                    </Grid>
                    <Grid size={12}>
                      <CustomOutlinedInput
                        startAdornment={
                          <InputAdornment position="start">
                            <IconPhone size="20" />
                          </InputAdornment>
                        }
                        id="phone"
                        {...register('phone')}
                        fullWidth
                        inputProps={{ maxLength: 12 }} // Limita la longitud a 12
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/[^0-9]/g, '');
                        }}
                      />
                      {errors.phone && (
                        <Typography variant="caption" color="error">
                          {errors.phone.message}
                        </Typography>
                      )}
                    </Grid>

                    <Grid size={12}>
                      <CustomFormLabel htmlFor="email" sx={{ mt: 0 }}>
                        Correo Electrónico
                      </CustomFormLabel>
                    </Grid>
                    <Grid size={12}>
                      <CustomOutlinedInput
                        startAdornment={
                          <InputAdornment position="start">
                            <IconMail size="20" />
                          </InputAdornment>
                        }
                        id="email"
                        type="email"
                        {...register('email')}
                        fullWidth
                        placeholder="ejemplo@correo.com"
                        onChange={(e) => {
                          handleEmailChange(e);
                          // También llamar al onChange de register para mantener sincronizado
                          const { onChange } = register('email');
                          onChange(e);
                        }}
                      />
                      {errors.email && (
                        <Typography variant="caption" color="error">
                          {errors.email.message}
                        </Typography>
                      )}

                      {/* Validación del correo electrónico */}
                      {emailValidation === 'exists' && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ display: 'block', mt: 1 }}
                        >
                          {emailValidationMessage}
                        </Typography>
                      )}
                    </Grid>

                    {/*
                siteKey = 6LfVdVwrAAAAAHX1wbJtRmc2ZGF_JrALgEpTvBWb
                secretKey = 6LeoeVwrAAAAACDRNrQUJu6JECXXA8Gv-DdZcACg
                https://www.google.com/recaptcha/api/siteverify
                */}
                    <Grid size={12}>
                      <Box mt={0} mb={2} display="flex" justifyContent="center">
                        {/* reCAPTCHA v3 no tiene un componente visual como v2 */}
                        {/* El score se muestra en la consola del navegador */}
                      </Box>
                    </Grid>

                    <Button
                      color="primary"
                      variant="contained"
                      size="large"
                      fullWidth
                      type="submit"
                      disabled={
                        isLoading ||
                        !isValid ||
                        isRecaptchaLoading ||
                        !isRecaptchaReady ||
                        driverCodeValidation !== 'valid' ||
                        dniValidation === 'driver' ||
                        emailValidation === 'exists'
                      }
                      startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                      {isLoading
                        ? 'Registrando...'
                        : !isRecaptchaReady
                        ? 'Registrando...'
                        : 'Registrar'}
                    </Button>

                    {/* Score de reCAPTCHA solo en consola para debugging */}
                  </Grid>
                </form>
              </div>
              {alertMessage && (
                <Snackbar
                  open={open}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  autoHideDuration={6000}
                  onClose={handleClose}
                >
                  <Alert
                    variant="filled"
                    severity={alertSeverity}
                    onClose={() => setAlertMessage(null)}
                  >
                    {alertMessage}
                  </Alert>
                </Snackbar>
              )}
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default ReferalRegister;
