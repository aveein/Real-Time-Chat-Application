io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    console.log('sdfsdf');
    if (!username) {
      return next(new Error("invalid username"));
    }
    socket.username = username;
    next();
  });